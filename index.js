var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: false,
  transparent: true,
  backgroundColor: '#4488aa',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [Scene1, Scene2]
};

var game = new Phaser.Game(config); 