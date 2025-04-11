import levels from '../data/levels';

export default class LevelSelectScene extends Phaser.Scene {
  private readonly BUTTONS_PER_ROW = 4;
  private readonly BUTTON_PADDING = 20;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    
    // Add title
    this.add.text(centerX, 50, 'Select Level', {
      fontSize: '48px',
      color: '#333',
      fontFamily: 'Chewy'
    }).setOrigin(0.5);

    // Add back button
    const backButton = this.add.text(50, 50, '← Back', {
      fontSize: '24px',
      color: '#333',
      padding: { x: 10, y: 5 },
      fontFamily: 'Chewy'
    })
    .setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('HomeScene');
    });

    // Calculate button size and grid layout
    const buttonWidth = 100;
    const buttonHeight = 100;
    const startY = 150;
    
    // Create level buttons
    levels.forEach((level, index) => {
      const row = Math.floor(index / this.BUTTONS_PER_ROW);
      const col = index % this.BUTTONS_PER_ROW;
      
      const x = centerX + (col - this.BUTTONS_PER_ROW/2 + 0.5) * 
                (buttonWidth + this.BUTTON_PADDING);
      const y = startY + row * (buttonHeight + this.BUTTON_PADDING);
      
      const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x4CAF50)
        .setInteractive({ useHandCursor: true });
        
      const levelText = this.add.text(x, y, `Level ${index + 1}`, {
        fontSize: '24px',
        color: '#fff',
        fontFamily: 'Chewy'
      }).setOrigin(0.5);
      
      // Group button and text for hover effects
      const buttonGroup = [button, levelText];
      
      button.on('pointerover', () => {
        button.setFillStyle(0x45a049);
      });
      
      button.on('pointerout', () => {
        button.setFillStyle(0x4CAF50);
      });
      
      button.on('pointerdown', () => {
        this.scene.start('GameScene', { levelId: index });
      });
    });
  }
}
