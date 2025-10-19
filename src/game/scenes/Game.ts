import Player from '../entities/player'
import Generator from '../entities/generator'

class Game extends Phaser.Scene {
  player: Player | null
  score: number
  scoreText: Phaser.GameObjects.BitmapText | null
  name: string
  number: number
  width: number
  height: number
  center_width: number
  center_height: number
  obstacles: Phaser.GameObjects.Group
  coins: Phaser.GameObjects.Group
  generator: Generator
  SPACE: Phaser.Input.Keyboard.Key
  updateScoreEvent: Phaser.Time.TimerEvent
  audios: { jump: Phaser.Sound.BaseSound; coin: Phaser.Sound.BaseSound; dead: Phaser.Sound.BaseSound }
  theme: Phaser.Sound.BaseSound
  jumpTween: Phaser.Tweens.Tween | undefined

  constructor() {
    super({ key: 'game' })
    this.player = null
    this.score = 0
    this.scoreText = null
  }

  init(data: { name: string; number: number }) {
    this.name = data.name
    this.number = data.number
  }

  preload() {
    this.registry.set('score', 0)
    this.load.audio('coin', 'assets/sounds/coin.mp3')
    this.load.audio('jump', 'assets/sounds/jump.mp3')
    this.load.audio('dead', 'assets/sounds/dead.mp3')
    this.load.audio('theme', 'assets/sounds/theme.mp3')
    this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 32, frameHeight: 32 })
    this.load.bitmapFont('arcade', 'assets/fonts/arcade.png', 'assets/fonts/arcade.xml')
    this.score = 0
  }

  create() {
    this.width =
      typeof this.sys.game.config.width === 'string' ? parseInt(this.sys.game.config.width) : this.sys.game.config.width
    this.height =
      typeof this.sys.game.config.height === 'string'
        ? parseInt(this.sys.game.config.height)
        : this.sys.game.config.height
    this.center_width = this.width / 2
    this.center_height = this.height / 2

    this.cameras.main.setBackgroundColor(0x87ceeb)
    this.obstacles = this.add.group()
    this.coins = this.add.group()
    this.generator = new Generator(this)
    this.SPACE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.player = new Player(this, this.center_width - 100, this.height - 200)
    this.scoreText = this.add.bitmapText(this.center_width, 10, 'arcade', this.score.toString(), 20)

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle,
      () => {
        return true
      },
      this
    )

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoin,
      () => {
        return true
      },
      this
    )

    this.loadAudios()
    this.playMusic()

    /*
    We use the `pointerdown` event to listen to the mouse click or touch event.
    */
    this.input.on('pointerdown', this.jump, this)

    /*
    We use `updateScoreEvent` to update the score every 100ms so the player can see the score increasing as long as he survives.
    */
    this.updateScoreEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.updateScore(),
      callbackScope: this,
      loop: true,
    })
  }

  hitObstacle() {
    this.updateScoreEvent.destroy()
    this.finishScene()
  }

  hitCoin(_: any, coin: any) {
    this.playAudio('coin')
    this.updateScore(1000)
    coin.destroy()
  }

  loadAudios() {
    this.audios = {
      jump: this.sound.add('jump'),
      coin: this.sound.add('coin'),
      dead: this.sound.add('dead'),
    }
  }

  playAudio(key: string) {
    this.audios[key as keyof typeof this.audios].play()
  }

  playMusic(theme: string = 'theme') {
    this.theme = this.sound.add(theme)
    this.theme.stop()
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    })
  }

  update() {
    if (this.SPACE && Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.jump()
    } else if (this.player?.body.blocked.down) {
      this.jumpTween?.stop()
      this.player.rotation = 0
      // ground
    }
  }

  jump() {
    if (!this.player?.body.blocked.down) return
    this.player!.body.setVelocityY(-300)

    this.playAudio('jump')
    this.jumpTween = this.tweens.add({
      targets: this.player,
      duration: 1000,
      angle: { from: 0, to: 360 },
      repeat: -1,
    })
  }

  finishScene() {
    this.theme.stop()
    this.playAudio('dead')
    this.registry.set('score', '' + this.score)
    this.scene.start('gameover')
  }

  updateScore(points: number = 1) {
    this.score += points
    this.scoreText!.setText(this.score.toString())
  }
}

export default Game
