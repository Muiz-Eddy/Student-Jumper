class Scene2 extends Phaser.Scene {
    constructor() {
        super('Scene2')
    }

    create() {
        const {height, width} = this.game.config;
        this.background = this.add.tileSprite(width/2, height/2, 1280, 720, "background");
        this.played = false;
        this.isGameRunning = false;
        this.gameSpeed = 10;
        this.respawnTime = 0;
        this.score = 0;
        this.bonusPoints = 0;
        this.bonusLife = false;
        this.goal1 = 100;
        this.goal2 = this.goal1/2;
        this.playerMale = true;
        this.highscore = (localStorage.highscore!=null) ? localStorage.highscore : 0;
        
        this.startTrigger = this.physics.add.sprite(0,400).setOrigin(0,1).setImmovable();
        this.ground = this.add.tileSprite(0,height,88,26, 'ground').setOrigin(0,1);

        this.startinfo = this.add.image(0, 310, 'space-play');
        this.instruction = this.add.image(0, -30, 'instruction');
        this.infoScreen = this.add.container(width/2, height/2);
        this.infoScreen.add([
            this.instruction, this.startinfo
        ]);

        this.quizzes = [
            [ 'What is the 4 digit number for this module code? SS-____\nA. 4303\nB. 4304\nC. 4330\nD. 4340\n\nEnter the LETTER only :', 'B' ],
            [ 'Fill in the blank\nMr. Chong _ _ _ Onn teaches the modules Internet Application.', 'KIM' ],
            [ '___________ was the PHP framework taught in this module.\nA. React.js\nB. Express.js\nC. CodeIgniter4\nD. Flutter\n\nEnter the LETTER only :', 'C' ],
            [ 'Fill in the blank.\n_______ is the open source framework we used to make the app, berkurapak.', 'FLUTTER' ],
            [ '________ is a open-source front-end Javascript library that uses the command "npx create-react-app"\nA. Node.js\nB. AR.js\nC. React.js\nD. Anime.js\n\nEnter the LETTER only :', 'C' ],
            [ 'Fill in the blank.\n________ is the hosting service we used to store data for the app "berkurapak".', 'FIREBASE' ],
            [ 'What was the file name Mr.Chong gave for his own Flutter app?\nA. berkurapak\nB. Kurapak\nC. ChatApp\nD. Bercerita\n\nEnter the LETTER only :', 'A' ],
            [ 'During the class test, what was the color of the background for the TWO dice version?', 'PURPLE' ],
            [ 'During the class test, what was the color of the background for the FOUR dice version?', 'ORANGE' ],
            [ 'What is the command used to create a react app?\nA. npm create-react-app\nB. npx create-react\nC. npx create-react-app\nD. npm create-react\n\nEnter the LETTER only :', 'C' ],
            [ 'When was our first class test?\nA. 05/09\nB. 12/09\nC. 19/09\nD. 26/09\n\nEnter the LETTER only :' , 'B' ],
            [ 'Which of the following is not part of the JavaScript libraries for the written assignment?\nA. React\nB. Leaflet\nC. Johnny-5\nD. Underscore\n\nEnter the LETTER only :' , 'D' ],
            [ 'What type of framework is CodeIgniter4?\nA. MVC\nB. MVVM\nC. MVP\nD. MVT\n\nEnter the LETTER only :' , 'A' ],
            [ 'Which SQL statement is used to insert new data in a database?\nA. INSERT NEW\nB. ADD NEW\nC. ADD RECORD\nD. INSERT INTO\n\nEnter the LETTER only :' , 'D' ],
            [ 'Where can a JavaScript be inserted?\nA. <head>\nB. <body>\nC. Both\nD. Neither\n\nEnter the LETTER only :' , 'C' ],
            [ 'In order to write any Dart program, be it a script or a Flutter app, you must define a function _ _ _ _ () which tells Dart where the program starts, and it must be in the file that is considered the "entry point" for your program.' , 'MAIN' ],
            [ 'The first Flutter app we built in Android Studio is called the "i am _ _ _ _" app.' , 'RICH' ],
            [ 'The GIT repository we cloned in Android Studio is "https://github.com/_ _ _ _ _ _/mi_card.git"' , 'KIMONN' ],
            [ 'Fill in the blank\nHTML stands for Hyper Text _ _ _ _ _ _ Language.' , 'MARKUP' ],
            [ 'Fill in the blank\nThe HTTP _ _ _ _ method sends data to the server.' , 'POST' ]
        ];

        this.quizNum = 0;
        this.quiz_order = [];
        for (let i = 0; i < this.quizzes.length; i++) {
            this.quiz_order = this.quiz_order.concat(i);
        }
        for (let a = this.quiz_order.length - 1; a > 0 ; a-- ) {
            let b = Math.floor(Math.random() * (a+1));
            let temp = this.quiz_order[a];
            this.quiz_order[a] = this.quiz_order[b];
            this.quiz_order[b] = temp;
        }

        this.gameOverScreen = this.add.container(width/2, height/2).setAlpha(0);
        this.gameOverText = this.add.image(0,-40, 'game-over');
        this.restart = this.add.image(0,40, 'restart').setInteractive();
        this.overlay = this.add.image(0,0, 'darken');
        this.gameOverScreen.add([
            this.overlay, this.gameOverText, this.restart
        ]);

        this.player = this.physics.add.sprite(0, height, 'player', (this.playerMale) ? 4 : 0)
            .setOrigin(0,0)
            .setCollideWorldBounds(true)
            .setGravityY(5000);

        this.obstacles = this.physics.add.group();
        
        this.gradesA = this.physics.add.group();
        this.gradesF = this.physics.add.group();

        this.gradeScoring();
        this.physics.add.overlap(this.player, this.gradesA, collect, null, this);
        this.physics.add.overlap(this.player, this.gradesF, collect, null, this);

        this.music = this.sound.add('music',{volume: 0.2})
        this.jumpSfx = this.sound.add('jump', {volume: 0.4})
        this.pointssfx = this.sound.add('grade_A', {volume: 0.4})
        this.minuspointssfx = this.sound.add('grade_F', {volume: 0.4})
        this.collideSfx = this.sound.add('hit', {volume: 1.0})

        this.initColliders();
        this.handleInputs();
        this.initStartTrigger();
    }

    gameReset() {
        this.player.setVelocityY(0);
        this.player.body.height = 250;
        this.player.body.offset.y = 0;
        this.physics.resume();
        this.obstacles.clear(true,true);
        this.isGameRunning = true;
        this.gameOverScreen.setAlpha(0);
        this.anims.resumeAll();
        this.music.play();
    }

    initBonusLife() {
        if(this.bonusLife) {
            this.bonusLife = false;
            var answer = prompt(this.quizzes[this.quiz_order[this.quizNum]][0]);
            if(answer != null) {
                if(answer.toUpperCase() == this.quizzes[this.quiz_order[this.quizNum]][1]) {
                    this.gameReset();
                }
            }
            if(this.quizNum == this.quiz_order.length-1){
                this.quizNum = 0;
            } else {
                this.quizNum+=1;
            }
        }
    }

    initColliders() {
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.collideSfx.play();
            this.music.stop();
            this.physics.pause();
            this.isGameRunning = false;
            this.anims.pauseAll();
            this.player.play('player-hurt');
            this.respawnTime = 0;
            this.gameOverScreen.setAlpha(1);
            this.gameOverScreen.depth = 1;
            this.initBonusLife();
            localStorage.setItem('highscore', this.highscore);
        }, null, this)
    }

    initStartTrigger() {
        const {width, height} = this.game.config;
        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, height);
                return;
            }
            this.initAnims();
            this.played = true;
            var style = { font: 'bold 22px Arial', fill: '#ffffff' };
            this.hsText = this.add.text(1095, 16, `Highscore: ${this.highscore}`, style);
            this.scoreText = this.add.text(1142, 46, 'Score: 0', style);
            this.infoScreen.destroy();
            this.timer = this.time.addEvent({delay: 100000, timeScale: 0.005});
            this.startTrigger.disableBody(true,true);
            this.music.play();
            const startEvent = this.time.addEvent({
                delay: 1000/60,
                loop:true,
                callbackScope: this,
                callback: () => {
                    this.player.setVelocityX(80);
                    this.player.play('player-run', 1);
                    if(this.ground.width < width) {
                        this.ground.width += 17 * 2;
                    }
                    if(this.ground.width >= width) {
                        this.ground.width = width;
                        this.isGameRunning = true;
                        this.player.setVelocity(0);
                        startEvent.remove();
                    }
                }
            })
        })
    }

    initAnims() {
        var spr = [];
        if (this.playerMale) {
            spr = [5, 6, 2, 3, 4, 7]; // load male sprite
        } else {
            spr = [1, 2, 0, 1, 0, 3]; // load female sprite
        }

        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('player', {start:spr[0], end: spr[1]}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'player-down-anim',
            frames: this.anims.generateFrameNumbers('player-down', {start:spr[2], end: spr[3]}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'player-jump',
            frames: [ { key: 'player', frame: spr[4] } ],
            frameRate: 20,
        });
        this.anims.create({
            key: 'player-hurt',
            frames: [ { key: 'player', frame: spr[5] } ],
            frameRate: 20,
        });
    }

    handleInputs(){
        this.restart.on('pointerdown', () =>  {
            this.gameReset();
            this.gameSpeed = 10;
            this.score = 0;
            this.bonusPoints = 0;
            this.goal1 = 100;
            this.goal2 = this.goal1/2;
            this.timer = this.time.addEvent({delay: 100000, timeScale: 0.005});
        })

        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.player.body.onFloor()) {
                return;
            }
            this.player.body.height = 250;
            this.player.body.offset.y = 0;
            this.jumpSfx.play();
            this.player.setVelocityY(-1800);
        })

        this.input.keyboard.on('keydown-DOWN', () => {
            if (!this.player.body.onFloor()) {
                this.player.setVelocityY(1000);
            }
            this.player.body.height = 210;
            this.player.body.offset.y = 0;
        })

        this.input.keyboard.on('keyup-DOWN', () => {
            this.player.body.height = 250;
            this.player.body.offset.y = 0;
        })

        this.input.keyboard.on('keydown-CTRL', () => {
            if (!this.isGameRunning && !this.played) {
                this.playerMale = !this.playerMale;
                this.player.setTexture('player', (this.playerMale) ? 4 : 0);
            }
        })
    }

    placeObstacle() {
        const {width, height} = this.game.config;
        const obstacleNum = Math.floor(Math.random()*5) + 2;
        const obstacleTextNum = Math.floor(Math.random()*6) + 1;
        const bookObstacleNum = Math.floor(Math.random()*4) + 1;
        const book2ObstacleNum = Math.floor(Math.random()*2) + 1;
        const distance = Phaser.Math.Between(600, 900);

        let obstacle;
        let obstacle2;

        if (obstacleNum <=2) {
            const enemyHeight = [200, 400];
            obstacle = this.obstacles.create(width+distance, height-enemyHeight[Math.floor(Math.random()*2)] , `textObstacle-${obstacleTextNum}`).setOrigin(0,0);
            obstacle.body.height = obstacle.body.height / 1.5;
        } else if(obstacleNum == 5){
            obstacle = this.obstacles.create(width+distance, height, `book-${bookObstacleNum}`);
            obstacle.body.offset.y = +10;
        }
        else {
            const enemyHeight = [720,720];
            obstacle = this.obstacles.create(width + distance, height, `book-${bookObstacleNum}`).setOrigin(0,1);
            obstacle2 = this.obstacles.create(width + distance, height-enemyHeight[Math.floor(Math.random()*2)] , `book-${book2ObstacleNum}`).setOrigin(0,0);
            obstacle.body.offset.y = +10;
            obstacle2.body.offset.y = +10;
        }
        obstacle.setOrigin(0,1).setImmovable;
    }

    placeGrade() {
        const {width, height} = this.game.config;
        const gradeNum = Math.floor(Math.random()*2) + 1;
        const distance = Phaser.Math.Between(600, 900);

        let gradeA;
        let gradeF;

        if (gradeNum == 1) {
            const enemyHeight = [200, 400];
            gradeA = this.gradesA.create(width+distance, height-enemyHeight[Math.floor(Math.random()*2)], 'A-grade').setOrigin(0,0);
            gradeA.body.height = gradeA.body.height/1.5;
        } else {
            const enemyHeight = [200, 400];
            gradeF = this.gradesF.create(width+distance, height-enemyHeight[Math.floor(Math.random()*2)], 'F-grade').setOrigin(0,0);
            gradeF.body.height = gradeF.body.height/1.5;
        }
    }

    gradeScoring() {
        var points = 30;
        this.physics.add.collider(this.player, this.gradesA, () => {
            this.pointssfx.play()
            this.bonusPoints += points;
        }, null, this)
        this.physics.add.collider(this.player, this.gradesF, () => {
            this.minuspointssfx.play()
            this.bonusPoints -= points;
        }, null, this)
    }

    update(time, delta) {
        if (!this.isGameRunning) {
            return;
        }

        this.background.tilePositionX += this.gameSpeed-7;
        this.ground.tilePositionX += this.gameSpeed;
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.gradesA.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.gradesF.getChildren(), -this.gameSpeed);

        this.respawnTime += delta * this.gameSpeed * 0.08;

        this.score = Math.floor(this.timer.getElapsed()) + this.bonusPoints;
        this.scoreText.setText('Score: ' + this.score);

        if (this.score >= this.highscore) {
            this.highscore = this.score
        }
        this.hsText.setText('Highscore: ' + this.highscore);

        if(this.score > this.goal1) {
            this.bonusLife = true;
            this.goal1 += 100;
        }
        if(this.score > this.goal2) {
            if(this.gameSpeed < 20) {
                this.gameSpeed += 0.5;
            }
            this.goal2 += 50;
        }

        if(this.respawnTime >= 1500) {
            if(Math.floor(Math.random()*5) == 0) {
                this.placeGrade();
            } else {
                this.placeObstacle();
            }
            this.respawnTime = 0;
        }

        this.obstacles.getChildren().forEach(obstacle => {
            if(obstacle.getBounds().right < 0 ) {
                obstacle.destroy();
            }
        })

        this.gradesA.getChildren().forEach(gradeA => {
            if(gradeA.getBounds().right < 0 ) {
                gradeA.destroy();
            }
        })

        this.gradesF.getChildren().forEach(gradeF => {
            if(gradeF.getBounds().right < 0 ) {
                gradeF.destroy();
            }
        })

        if (this.player.body.deltaAbsY() > 0) {
            this.player.anims.stop();
            this.player.play('player-jump', true);
        }
        else {
            this.player.body.height <= 210 ? 
            this.player.play('player-down-anim', true) :
            this.player.play('player-run', true);
        }
    }
}

function collect (player, grade) {
    grade.disableBody(true, true);
}