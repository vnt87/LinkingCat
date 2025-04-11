import React, { useState, useEffect } from 'react';
import { Cell, ColorType, Endpoint, Path } from '../types/game';
import GameCell from './GameCell';

interface GameBoardProps {
  gridSize: number;
  endpoints: Endpoint[];
  onPathComplete: (color: ColorType) => void;
  onPuzzleComplete: () => void;
  paths: Path[];
  setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gridSize, 
  endpoints, 
  onPathComplete,
  onPuzzleComplete,
  paths,
  setPaths
}) => {
  const [activePath, setActivePath] = useState<Path | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getEndpointAtCell = (row: number, col: number): Endpoint | undefined => {
    return endpoints.find(ep => ep.position.row === row && ep.position.col === col);
  };

  const isCellInPath = (row: number, col: number, pathColor?: ColorType): boolean => {
    if (pathColor) {
      return paths
        .filter(p => p.color === pathColor)
        .some(path => path.cells.some(cell => cell.row === row && cell.col === col));
    }
    return paths.some(path => 
      path.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  const getPathColorAtCell = (row: number, col: number): ColorType | undefined => {
    for (const path of paths) {
      if (path.cells.some(cell => cell.row === row && cell.col === col)) {
        return path.color;
      }
    }
    if (activePath?.cells.some(cell => cell.row === row && cell.col === col)) {
      return activePath.color;
    }
    return undefined;
  };

  const handleCellDown = (cell: Cell) => {
    const endpoint = getEndpointAtCell(cell.row, cell.col);
    if (!endpoint) return;

    // Find the matching endpoint
    const matchingEndpoints = endpoints.filter(ep => ep.color === endpoint.color);
    
    // Clear any existing path for this color
    setPaths(paths.filter(p => p.color !== endpoint.color));
    
    setActivePath({
      color: endpoint.color,
      cells: [{ row: cell.row, col: cell.col }],
      isComplete: false
    });
    
    setIsDragging(true);
  };

  const handleCellEnter = (cell: Cell) => {
    if (!isDragging || !activePath) return;
    
    const lastCell = activePath.cells[activePath.cells.length - 1];
    
    // Check if the cell is adjacent to the last cell in the path
    const isAdjacent = 
      (Math.abs(cell.row - lastCell.row) === 1 && cell.col === lastCell.col) ||
      (Math.abs(cell.col - lastCell.col) === 1 && cell.row === lastCell.row);
    
    if (!isAdjacent) return;
    
    // Check if the cell is already in the path
    const isInCurrentPath = activePath.cells.some(
      c => c.row === cell.row && c.col === cell.col
    );
    
    if (isInCurrentPath) {
      // If it's the second-to-last cell, allow backtracking
      if (activePath.cells.length >= 2 && 
          cell.row === activePath.cells[activePath.cells.length - 2].row &&
          cell.col === activePath.cells[activePath.cells.length - 2].col) {
        setActivePath({
          ...activePath,
          cells: activePath.cells.slice(0, -1)
        });
      }
      return;
    }
    
    // Check if the cell is an endpoint for this color
    const endpoint = getEndpointAtCell(cell.row, cell.col);
    
    // Check if the cell is occupied by another path
    const isOccupiedByOtherPath = paths.some(path => 
      path.color !== activePath.color && 
      path.cells.some(c => c.row === cell.row && c.col === cell.col)
    );
    
    if (isOccupiedByOtherPath) return;
    
    // If this is an endpoint of the same color, complete the path
    if (endpoint && endpoint.color === activePath.color && 
        !(cell.row === activePath.cells[0].row && cell.col === activePath.cells[0].col)) {
      const updatedPath = {
        ...activePath,
        cells: [...activePath.cells, { row: cell.row, col: cell.col }],
        isComplete: true
      };
      
      setActivePath(updatedPath);
      setPaths([...paths, updatedPath]);
      onPathComplete(activePath.color);
      setActivePath(null);
      setIsDragging(false);
      
      // Check if all paths are complete
      const allPathsComplete = 
        endpoints.length / 2 === paths.length + 1 && 
        paths.every(p => p.isComplete);
      
      if (allPathsComplete) {
        onPuzzleComplete();
      }
      
      return;
    }
    
    // Add the cell to the path
    setActivePath({
      ...activePath,
      cells: [...activePath.cells, { row: cell.row, col: cell.col }]
    });
  };

  const handleCellUp = () => {
    if (isDragging && activePath && !activePath.isComplete) {
      // If path was not completed, save the partial path
      setPaths([...paths, activePath]);
    }
    setIsDragging(false);
    setActivePath(null);
  };

  return (
    <div 
      className="w-full aspect-square border border-gray-300 grid"
      style={{ 
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        touchAction: 'none' 
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        const endpoint = getEndpointAtCell(row, col);
        const pathColor = getPathColorAtCell(row, col);
        
        return (
          <GameCell
            key={index}
            row={row}
            col={col}
            hasEndpoint={!!endpoint}
            endpointColor={endpoint?.color}
            pathColor={pathColor}
            isHighlighted={
              activePath?.cells.some(cell => cell.row === row && cell.col === col) || false
            }
            onCellEnter={handleCellEnter}
            onCellDown={handleCellDown}
            onCellUp={handleCellUp}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
