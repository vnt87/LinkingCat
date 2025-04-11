import 'phaser';
import HomeScene from './scenes/HomeScene';
import LevelSelectScene from './scenes/LevelSelectScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: '#f0f0f0',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [HomeScene, LevelSelectScene, GameScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
