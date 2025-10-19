class Coin extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.setAllowGravity(false)
    this.init()
  }
  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 820, to: -100 },
      duration: 2000,
      onComplete: () => {
        this.destroy()
      },
    })

    // only create the animation if it doesn't already exist
    if (!this.scene.anims.get('coin')) {
      this.scene.anims.create({
        key: 'coin',
        frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
        frameRate: 8,
      })
    }
    this.play({ key: 'coin', repeat: -1 })
  }
}

export default Coin
