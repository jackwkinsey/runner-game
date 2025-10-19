import Cloud from './cloud'
import Obstacle from './obstacle'
import Coin from './coin'
import Game from '../scenes/Game'

export default class Generator {
  scene: Game

  constructor(scene: Game) {
    this.scene = scene
    this.scene.time.delayedCall(2000, () => this.init(), [], this)
  }

  init() {
    this.generateCloud()
    this.generateObstacle()
    this.generateCoin()
  }

  generateCloud() {
    new Cloud(this.scene, 800, 0)
    this.scene.time.delayedCall(Phaser.Math.Between(2000, 3000), () => this.generateCloud(), [], this)
  }

  generateObstacle() {
    this.scene.obstacles.add(new Obstacle(this.scene, 800, this.scene.height - Phaser.Math.Between(32, 128)))
    this.scene.time.delayedCall(Phaser.Math.Between(1500, 2500), () => this.generateObstacle(), [], this)
  }

  generateCoin() {
    this.scene.coins.add(new Coin(this.scene, 800, this.scene.height - Phaser.Math.Between(32, 128)))
    this.scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => this.generateCoin(), [], this)
  }
}
