import { describe, it, expect, beforeEach, vi } from 'vitest'
import Coin from '../coin'

describe('Coin', () => {
  let scene: Phaser.Scene
  let coin: Coin

  beforeEach(() => {
    scene = new Phaser.Scene()
    coin = new Coin(scene, 800, 300)
  })

  it('should create a coin at the specified position', () => {
    expect(coin.x).toBe(800)
    expect(coin.y).toBe(300)
  })

  it('should use the coin texture', () => {
    expect(coin.texture).toBe('coin')
  })

  it('should be added to the scene', () => {
    expect(scene.add.existing).toHaveBeenCalledWith(coin)
  })

  it('should have physics enabled', () => {
    expect(scene.physics.add.existing).toHaveBeenCalledWith(coin)
  })

  it('should have gravity disabled', () => {
    expect(coin.body.setAllowGravity).toHaveBeenCalledWith(false)
  })

  it('should initialize tween animation on creation', () => {
    expect(scene.tweens.add).toHaveBeenCalled()

    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.targets).toBe(coin)
    expect(tweenConfig.duration).toBe(2000)
  })

  it('should move from right to left', () => {
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.x).toEqual({ from: 820, to: -100 })
  })

  it('should have onComplete callback that destroys the coin', () => {
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.onComplete).toBeDefined()

    if (tweenConfig.onComplete) {
      tweenConfig.onComplete()
      expect(coin.destroy).toHaveBeenCalled()
    }
  })

  it('should create animation if it does not exist', () => {
    vi.mocked(scene.anims.get).mockReturnValue(null)

    const newCoin = new Coin(scene, 800, 300)

    expect(scene.anims.create).toHaveBeenCalledWith({
      key: 'coin',
      frames: expect.any(Array),
      frameRate: 8,
    })
    expect(newCoin.play).toHaveBeenCalledWith({ key: 'coin', repeat: -1 })
  })

  it('should not recreate animation if it already exists', () => {
    const existingAnim = { key: 'coin' }
    vi.mocked(scene.anims.get).mockReturnValue(existingAnim as any)
    vi.mocked(scene.anims.create).mockClear()

    new Coin(scene, 800, 300)

    expect(scene.anims.get).toHaveBeenCalledWith('coin')
    expect(scene.anims.create).not.toHaveBeenCalled()
  })

  it('should play the coin animation', () => {
    expect(coin.play).toHaveBeenCalledWith({ key: 'coin', repeat: -1 })
  })
})
