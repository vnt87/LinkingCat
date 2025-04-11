export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Add title text
    const title = this.add.text(centerX, centerY - 100, 'LinkingCat', {
      fontSize: '64px',
      color: '#333',
      fontFamily: 'Chewy'
    }).setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(centerX, centerY + 50, 'Start Game', {
      fontSize: '32px',
      color: '#333',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
      fontFamily: 'Chewy'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    // Add hover effects
    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#fff' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#333' });
    });

    // Add click handler
    startButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });
  }
}
