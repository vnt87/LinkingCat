import levels from '../data/levels';
import { createRoundedButton } from '../utils/uiUtils';

export default class LevelSelectScene extends Phaser.Scene {
  private readonly BUTTONS_PER_ROW = 3;
  private readonly BUTTON_PADDING = 20;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    
    // Add title
    this.add.text(centerX, height * 0.1, 'Select Level', {
      fontSize: '48px',
      color: '#333',
      fontFamily: 'Chewy'
    }).setOrigin(0.5);

    // Add back button
    const backButton = createRoundedButton(
      this,
      20,
      20,
      '← Back',
      120,
      40,
      0x666666
    );

    backButton.bg.on('pointerdown', () => {
      this.scene.start('HomeScene');
    });

    // Calculate button size and grid layout
    const buttonWidth = 120;
    const buttonHeight = 120;
    const startY = height * 0.2;
    
    // Create level buttons
    levels.forEach((level, index) => {
      const row = Math.floor(index / this.BUTTONS_PER_ROW);
      const col = index % this.BUTTONS_PER_ROW;
      
      const x = centerX + (col - this.BUTTONS_PER_ROW/2 + 0.5) * 
                (buttonWidth + this.BUTTON_PADDING);
      const y = startY + row * (buttonHeight + this.BUTTON_PADDING);
      
      const levelButton = createRoundedButton(
        this,
        x - buttonWidth/2,
        y - buttonHeight/2,
        `Level ${index + 1}`,
        buttonWidth,
        buttonHeight
      );

      levelButton.bg.on('pointerdown', () => {
        this.scene.start('GameScene', { levelId: index });
      });
    });
  }
}
