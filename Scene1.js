class Scene1 extends Phaser.Scene {

    constructor() {
      super('bootgame');
    }
  
    preload() {

      // AUDIO
      this.load.audio('music', 'assets/sfx/Kevin MacLeod - Itty Bitty 8 Bit.mp3')
      this.load.audio('grade_A', 'assets/sfx/coin.mp3')
      this.load.audio('grade_F', 'assets/sfx/grade_F.mp3')
      this.load.audio('jump', 'assets/sfx/Jump1.mp3');
      this.load.audio('hit', 'assets/sfx/audio_hit.m4a');
      this.load.audio('reach', 'assets/sfx/audio_reach.m4a');
      

      // ENVIRONMENT /////////////////////////////////////
      this.load.image('background', 'assets/img/lockers.png');
      this.load.image('ground', 'assets/img/platform.png');
      this.load.image('restart', 'assets/img/restart.png');
      this.load.image('game-over', 'assets/img/gameover.png');
      this.load.image('darken', 'assets/img/overlay.png');
      this.load.image('instruction', 'assets/img/instruction.png');
      this.load.image('space-play', 'assets/img/space_play.png');


      // PLAYER /////////////////////////////////////////
      this.load.spritesheet('player', 'assets/img/player_spritesheet.png', {
        frameWidth: 90,
        frameHeight: 250
      })
      this.load.spritesheet('player-down', 'assets/img/player_duck_spritesheet.png', {
        frameWidth: 90,
        frameHeight: 210
      })


      // COLLECTIBLES ///////////////////////////////////
      this.load.image('A-grade', 'assets/img/gradeA.png');
      this.load.image('F-grade', 'assets/img/gradeF.png');
  

      // OBSTACLES /////////////////////////////////////
      //books
      this.load.image('book-1', 'assets/img/book_stack1.png');
      this.load.image('book-2', 'assets/img/book_stack2.png');
      this.load.image('book-3', 'assets/img/book_stack3.png');
      this.load.image('book-4', 'assets/img/book_stack4.png');

      //air
      this.load.image('textObstacle-1', 'assets/img/air_obstacles_1.png');
      this.load.image('textObstacle-2', 'assets/img/air_obstacles_2.png');
      this.load.image('textObstacle-3', 'assets/img/air_obstacles_3.png');
      this.load.image('textObstacle-4', 'assets/img/air_obstacles_4.png');
      this.load.image('textObstacle-5', 'assets/img/air_obstacles_5.png');
      this.load.image('textObstacle-6', 'assets/img/air_obstacles_6.png');
    }
  
    create() {
      this.scene.start('Scene2');
    }
  }
  
