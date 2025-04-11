import 'phaser';
import { Cell, ColorType, Endpoint, Level, Path } from '../types/game';
import levels from '../data/levels';

export default class GameScene extends Phaser.Scene {
  private gridSize!: number;
  private cellSize!: number;
  private offsetX!: number;
  private offsetY!: number;
  private currentLevel!: Level;
  private paths: Path[] = [];
  private activePath: Path | null = null;
  private isDragging = false;
  private graphics!: Phaser.GameObjects.Graphics;
  private history: Path[][] = [];
  private levelId: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { levelId?: number }) {
    this.levelId = data.levelId || 0;
    this.paths = [];
    this.activePath = null;
    this.isDragging = false;
    this.history = [];
  }

  create() {
    // Initialize level from provided levelId
    this.currentLevel = levels[this.levelId];
    this.gridSize = this.currentLevel.gridSize;
    
    // Calculate cell size and grid offset to center it
    this.cellSize = Math.min(
      this.cameras.main.width / (this.gridSize + 2), 
      this.cameras.main.height / (this.gridSize + 2)
    );
    
    this.offsetX = (this.cameras.main.width - this.gridSize * this.cellSize) / 2;
    this.offsetY = (this.cameras.main.height - this.gridSize * this.cellSize) / 2;
    
    // Create graphics object for drawing
    this.graphics = this.add.graphics();
    
    // Draw the initial grid and endpoints
    this.drawGrid();
    this.drawEndpoints();
    
    // Setup input handling
    this.input.on('pointerdown', this.handlePointerDown, this);
    this.input.on('pointermove', this.handlePointerMove, this);
    this.input.on('pointerup', this.handlePointerUp, this);
  }

  private drawGrid() {
    this.graphics.lineStyle(2, 0xcccccc);
    
    // Draw horizontal lines
    for (let i = 0; i <= this.gridSize; i++) {
      this.graphics.beginPath();
      this.graphics.moveTo(this.offsetX, this.offsetY + i * this.cellSize);
      this.graphics.lineTo(
        this.offsetX + this.gridSize * this.cellSize,
        this.offsetY + i * this.cellSize
      );
      this.graphics.strokePath();
    }
    
    // Draw vertical lines
    for (let i = 0; i <= this.gridSize; i++) {
      this.graphics.beginPath();
      this.graphics.moveTo(this.offsetX + i * this.cellSize, this.offsetY);
      this.graphics.lineTo(
        this.offsetX + i * this.cellSize,
        this.offsetY + this.gridSize * this.cellSize
      );
      this.graphics.strokePath();
    }
  }

  private drawEndpoints() {
    const radius = this.cellSize * 0.3;
    
    this.currentLevel.endpoints.forEach(endpoint => {
      const x = this.offsetX + (endpoint.position.col + 0.5) * this.cellSize;
      const y = this.offsetY + (endpoint.position.row + 0.5) * this.cellSize;
      
      this.graphics.fillStyle(this.getColorValue(endpoint.color));
      this.graphics.fillCircle(x, y, radius);
    });
  }

  private drawPaths() {
    // Clear previous paths
    this.graphics.clear();
    this.drawGrid();
    this.drawEndpoints();
    
    // Draw completed paths
    this.paths.forEach(path => this.drawPath(path));
    
    // Draw active path if exists
    if (this.activePath) {
      this.drawPath(this.activePath);
    }
  }

  private drawPath(path: Path) {
    if (path.cells.length < 2) return;
    
    const color = this.getColorValue(path.color);
    this.graphics.lineStyle(this.cellSize * 0.4, color, 0.6);
    
    this.graphics.beginPath();
    
    // Move to the first cell center
    const startX = this.offsetX + (path.cells[0].col + 0.5) * this.cellSize;
    const startY = this.offsetY + (path.cells[0].row + 0.5) * this.cellSize;
    this.graphics.moveTo(startX, startY);
    
    // Draw lines to each subsequent cell center
    for (let i = 1; i < path.cells.length; i++) {
      const x = this.offsetX + (path.cells[i].col + 0.5) * this.cellSize;
      const y = this.offsetY + (path.cells[i].row + 0.5) * this.cellSize;
      this.graphics.lineTo(x, y);
    }
    
    this.graphics.strokePath();
  }

  private getColorValue(color: ColorType): number {
    const colorMap: Record<ColorType, number> = {
      red: 0xff0000,
      blue: 0x0000ff,
      green: 0x00ff00,
      yellow: 0xffff00,
      purple: 0x800080,
      orange: 0xffa500,
      teal: 0x008080,
      pink: 0xff69b4
    };
    return colorMap[color];
  }

  private screenToGrid(x: number, y: number): Cell | null {
    const gridX = Math.floor((x - this.offsetX) / this.cellSize);
    const gridY = Math.floor((y - this.offsetY) / this.cellSize);
    
    if (gridX >= 0 && gridX < this.gridSize && gridY >= 0 && gridY < this.gridSize) {
      return { row: gridY, col: gridX };
    }
    
    return null;
  }

  private getEndpointAtCell(cell: Cell): Endpoint | undefined {
    return this.currentLevel.endpoints.find(ep => 
      ep.position.row === cell.row && ep.position.col === cell.col
    );
  }

  private isCellInPath(cell: Cell, pathColor?: ColorType): boolean {
    if (pathColor) {
      return this.paths
        .filter(p => p.color === pathColor)
        .some(path => path.cells.some(c => c.row === cell.row && c.col === cell.col));
    }
    return this.paths.some(path => 
      path.cells.some(c => c.row === cell.row && c.col === cell.col)
    );
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const cell = this.screenToGrid(pointer.x, pointer.y);
    if (!cell) return;
    
    const endpoint = this.getEndpointAtCell(cell);
    if (!endpoint) return;
    
    // Save current state before modifying
    this.saveToHistory();
    
    // Clear any existing path for this color
    this.paths = this.paths.filter(p => p.color !== endpoint.color);
    
    this.activePath = {
      color: endpoint.color,
      cells: [{ row: cell.row, col: cell.col }],
      isComplete: false
    };
    
    this.isDragging = true;
    this.drawPaths();

    // Launch UI Scene
    this.scene.launch('UIScene', { gameScene: this });
  }

  public undoLastMove() {
    if (this.history.length > 0) {
      this.paths = [...this.history.pop()!];
      this.activePath = null;
      this.drawPaths();
    }
  }

  private saveToHistory() {
    this.history.push([...this.paths]);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging || !this.activePath) return;
    
    const cell = this.screenToGrid(pointer.x, pointer.y);
    if (!cell) return;
    
    const lastCell = this.activePath.cells[this.activePath.cells.length - 1];
    
    // Check if the cell is adjacent
    const isAdjacent = 
      (Math.abs(cell.row - lastCell.row) === 1 && cell.col === lastCell.col) ||
      (Math.abs(cell.col - lastCell.col) === 1 && cell.row === lastCell.row);
    
    if (!isAdjacent) return;
    
    // Check if the cell is already in the path
    const isInCurrentPath = this.activePath.cells.some(
      c => c.row === cell.row && c.col === cell.col
    );
    
    if (isInCurrentPath) {
      // Allow backtracking if it's the second-to-last cell
      if (this.activePath.cells.length >= 2 && 
          cell.row === this.activePath.cells[this.activePath.cells.length - 2].row &&
          cell.col === this.activePath.cells[this.activePath.cells.length - 2].col) {
        this.activePath.cells.pop();
        this.drawPaths();
      }
      return;
    }
    
    // Check if cell is occupied by another path
    if (this.isCellInPath(cell)) return;
    
    // Check if this is the matching endpoint
    const endpoint = this.getEndpointAtCell(cell);
    if (endpoint && endpoint.color === this.activePath.color && 
        !(cell.row === this.activePath.cells[0].row && cell.col === this.activePath.cells[0].col)) {
      this.activePath.cells.push({ row: cell.row, col: cell.col });
      this.activePath.isComplete = true;
      this.paths.push(this.activePath);
      
      // Check if puzzle is complete
      if (this.isPuzzleComplete()) {
        console.log('Puzzle Complete!');
        // Add completion logic here
      }
      
      this.activePath = null;
      this.isDragging = false;
    } else {
      // Add the cell to the path
      this.activePath.cells.push({ row: cell.row, col: cell.col });
    }
    
    this.drawPaths();
  }

  private handlePointerUp() {
    if (this.isDragging && this.activePath && !this.activePath.isComplete) {
      this.paths.push(this.activePath);
    }
    this.isDragging = false;
    this.activePath = null;
    this.drawPaths();
  }

  private isPuzzleComplete(): boolean {
    return (
      this.currentLevel.endpoints.length / 2 === this.paths.length &&
      this.paths.every(p => p.isComplete)
    );
  }
}
