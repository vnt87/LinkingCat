import { createRoundedButton } from "../utils/uiUtils";

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Add title text
    const title = this.add.text(centerX, height * 0.3, 'LinkingCat', {
      fontSize: '64px',
      color: '#333',
      fontFamily: 'Chewy'
    }).setOrigin(0.5);

    // Add Play button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const playButton = createRoundedButton(
      this,
      centerX - buttonWidth/2,
      height * 0.5,
      'Play',
      buttonWidth,
      buttonHeight
    );

    playButton.bg.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });
  }
}
