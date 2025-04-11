import GameScene from './GameScene';
import { createRoundedButton } from '../utils/uiUtils';

export default class UIScene extends Phaser.Scene {
  private gameScene!: GameScene;
  private timerText!: Phaser.GameObjects.Text;
  private timeElapsed: number = 0;
  private timerEvent?: Phaser.Time.TimerEvent;
  private pauseOverlay?: Phaser.GameObjects.Rectangle;
  private menuButtons: { text: Phaser.GameObjects.Text; bg: Phaser.GameObjects.Graphics }[] = [];
  private gameBoardBottom: number = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: { gameScene: GameScene, gameBoardBottom?: number }) {
    this.gameScene = data.gameScene;
    this.timeElapsed = 0;
    this.gameBoardBottom = data.gameBoardBottom || this.scale.height * 0.7;
  }

  create() {
    this.createTimer();
    this.createButtons();
    this.createPauseMenu();
  }

  public startTimer() {
    if (!this.timerEvent) {
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }
  }

  private createTimer() {
    // Create timer text in top center
    this.timerText = this.add.text(this.scale.width / 2, 20, '00:00', {
      fontSize: '32px',
      color: '#333',
      fontFamily: 'Chewy'
    }).setOrigin(0.5, 0);
  }

  private updateTimer() {
    this.timeElapsed++;
    const minutes = Math.floor(this.timeElapsed / 60);
    const seconds = this.timeElapsed % 60;
    this.timerText.setText(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }


  private createButtons() {
    const { width } = this.scale;
    const buttonSpacing = 20;
    const buttonWidth = 120;
    const buttonHeight = 40;
    
    // Menu button (top right)
    const menuButton = createRoundedButton(
      this,
      width - buttonWidth - 20, 
      20, 
      '⏸️',
      buttonWidth,
      buttonHeight,
      0x666666
    );

    // Bottom buttons (centered under game board)
    const undoButton = createRoundedButton(
      this,
      width / 2 - buttonWidth - buttonSpacing / 2,
      this.gameBoardBottom + 20,
      '↩️ Undo'
    );

    const hintButton = createRoundedButton(
      this,
      width / 2 + buttonSpacing / 2,
      this.gameBoardBottom + 20,
      '💡 Hint'
    );

    // Add click handlers
    menuButton.bg.on('pointerdown', () => this.togglePauseMenu(true));
    undoButton.bg.on('pointerdown', () => {
      this.gameScene.undoLastMove();
    });
    hintButton.bg.on('pointerdown', () => {
      this.startTimer(); // Start timer if not already started
    });
  }

  private createPauseMenu() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create invisible overlay
    this.pauseOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
      .setOrigin(0)
      .setVisible(false)
      .setInteractive();

    // Create menu buttons
    const menuItems = ['Resume', 'Restart', 'Choose Level', 'Quit'];
    const buttonWidth = 200;
    const buttonHeight = 60;
    const padding = 20;
    const menuStartY = centerY - ((menuItems.length - 1) * (buttonHeight + padding) / 2);

    this.menuButtons = menuItems.map((item, index) => {
      const y = menuStartY + index * (buttonHeight + padding);
      const color = item === 'Quit' ? 0xf44336 : 0x4CAF50;
      
      const button = createRoundedButton(
        this,
        centerX - buttonWidth / 2,
        y,
        item,
        buttonWidth,
        buttonHeight,
        color
      );
      
      button.bg.setVisible(false);
      button.text.setVisible(false);

      button.bg.on('pointerdown', () => {
        switch (item) {
          case 'Resume':
            this.togglePauseMenu(false);
            break;
          case 'Restart':
            this.togglePauseMenu(false);
            this.scene.restart();
            this.gameScene.scene.restart();
            break;
          case 'Choose Level':
            this.scene.stop();
            this.gameScene.scene.stop();
            this.scene.start('LevelSelectScene');
            break;
          case 'Quit':
            this.scene.stop();
            this.gameScene.scene.stop();
            this.scene.start('LevelSelectScene');
            break;
        }
      });

      return button;
    });
  }

  private togglePauseMenu(visible: boolean) {
    if (this.pauseOverlay) {
      this.pauseOverlay.setVisible(visible);
      this.menuButtons.forEach(button => {
        button.bg.setVisible(visible);
        button.text.setVisible(visible);
      });
      
      if (visible) {
        if (this.timerEvent) this.timerEvent.paused = true;
        this.gameScene.scene.pause();
      } else {
        if (this.timerEvent) this.timerEvent.paused = false;
        this.gameScene.scene.resume();
      }
    }
  }
}
