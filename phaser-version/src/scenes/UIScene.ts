import GameScene from './GameScene';

export default class UIScene extends Phaser.Scene {
  private gameScene!: GameScene;
  private timerText!: Phaser.GameObjects.Text;
  private timeElapsed: number = 0;
  private timerEvent?: Phaser.Time.TimerEvent;
  private pauseOverlay?: Phaser.GameObjects.Rectangle;
  private menuButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: { gameScene: GameScene }) {
    this.gameScene = data.gameScene;
    this.timeElapsed = 0;
  }

  create() {
    this.createTimer();
    this.createButtons();
    this.createPauseMenu();
  }

  private createTimer() {
    // Create timer text in top-left corner
    this.timerText = this.add.text(20, 20, '00:00', {
      fontSize: '32px',
      color: '#333',
      fontFamily: 'Chewy'
    });

    // Start the timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
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
    const { width } = this.cameras.main;
    const buttonY = 20;
    const padding = 10;
    
    // Undo button (right side)
    const undoButton = this.add.text(width - 100, buttonY, 'Undo', {
      fontSize: '24px',
      color: '#333',
      backgroundColor: '#ddd',
      padding: { x: 10, y: 5 },
      fontFamily: 'Chewy'
    })
    .setOrigin(1, 0)
    .setInteractive({ useHandCursor: true });

    undoButton.on('pointerdown', () => {
      this.gameScene.undoLastMove();
    });

    // Hint button (right of timer)
    const hintButton = this.add.text(150, buttonY, '💡 Hint', {
      fontSize: '24px',
      color: '#333',
      backgroundColor: '#ddd',
      padding: { x: 10, y: 5 },
      fontFamily: 'Chewy'
    })
    .setInteractive({ useHandCursor: true });

    // Menu button (right of hint)
    const menuButton = this.add.text(250, buttonY, 'Menu', {
      fontSize: '24px',
      color: '#333',
      backgroundColor: '#ddd',
      padding: { x: 10, y: 5 },
      fontFamily: 'Chewy'
    })
    .setInteractive({ useHandCursor: true });

    menuButton.on('pointerdown', () => {
      this.togglePauseMenu(true);
    });

    // Add hover effects
    [undoButton, hintButton, menuButton].forEach(button => {
      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: '#ccc' });
      });

      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: '#ddd' });
      });
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
    const menuItems = ['Resume', 'Restart', 'Quit'];
    const buttonHeight = 50;
    const padding = 10;

    menuItems.forEach((item, index) => {
      const y = centerY - ((menuItems.length - 1) * (buttonHeight + padding) / 2) + 
                index * (buttonHeight + padding);

      const button = this.add.text(centerX, y, item, {
        fontSize: '32px',
        color: '#fff',
        backgroundColor: '#4CAF50',
        padding: { x: 20, y: 10 },
        fontFamily: 'Chewy'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: '#45a049' });
      });

      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: '#4CAF50' });
      });

      button.on('pointerdown', () => {
        switch (item) {
          case 'Resume':
            this.togglePauseMenu(false);
            break;
          case 'Restart':
            this.togglePauseMenu(false);
            this.scene.restart();
            this.gameScene.scene.restart();
            break;
          case 'Quit':
            this.scene.stop();
            this.gameScene.scene.stop();
            this.scene.start('LevelSelectScene');
            break;
        }
      });

      this.menuButtons.push(button);
    });
  }

  private togglePauseMenu(visible: boolean) {
    if (this.pauseOverlay) {
      this.pauseOverlay.setVisible(visible);
      this.menuButtons.forEach(button => button.setVisible(visible));
      
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
