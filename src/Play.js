class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 200
        this.SHOT_VELOCITY_Y_MAX = 1000
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        //add scoreboard

        let text_config = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth:0
        }

        this.score = 0
        this.scoreboard = this.add.text(width * 3/ 16, height / 10,"Score: " + ' ' + this.score, text_config)

        //add shot counter
        this.shotCount = 0
        this.shotCounter = this.add.text(width - width / 4, height / 10,"Shot #" + this.shotCount, text_config)
        
        let score_config = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth:0
        }

        //add shot percentage
        this.shotPercent = this.add.text(width - width / 8 * 3, height / 20 * 1,"Accuracy:0.00%", text_config)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls

        let wallA = this.physics.add.sprite(0,height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)
        wallA.setVelocityX(200)
        wallA.body.setBounce(1)
        wallA.body.setCollideWorldBounds(true)

        let wallB = this.physics.add.sprite(0,height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA,wallB])

        // add one-way

        this.oneWay = this.physics.add.sprite(0,height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0+this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.setImmovable(true)

        this,this.oneWay.body.checkCollision.down = false
        // add pointer input
        this.input.on('pointerdown',(pointer) => {
            this.shotCount += 1
            this.shotCounter.setText("Shot #" + this.shotCount)
            this.shotPercent.setText("Accuracy:"+(this.score / this.shotCount * 100).toFixed(2)+ "%")
            let shotDirectionY = pointer.y <= this.ball.y ? 1: -1
            let shotDirectionX = pointer.x <= this.ball.x ? 1: -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0,this.SHOT_VELOCITY_X)* shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN,this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
        })
        
        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.score += 1
            ball.setVelocity(0,0)
            ball.setX(width / 2)
            ball.setY(height - height / 10)
            this.scoreboard.setText("Score: " + ' ' + this.score)
            this.shotPercent.setText("Accuracy:"+(this.score / this.shotCount * 100).toFixed(2)+ "%")
        })

        // ball/wall collision
            this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
            this.physics.add.collider(this.ball, this.oneWay)

        //wall to border collision


        

    }

    update() {
        
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/