import { describe, it, expect, beforeEach, vi } from 'vitest'
import Cloud from '../cloud'

describe('Cloud', () => {
  let scene: Phaser.Scene

  beforeEach(() => {
    scene = new Phaser.Scene()
  })

  it('should create a cloud at the specified position', () => {
    const cloud = new Cloud(scene, 800, 50)
    expect(cloud.x).toBe(800)
    expect(cloud.y).toBe(50)
  })

  it('should generate random y position when y is 0', () => {
    const cloud = new Cloud(scene, 800, 0)
    expect(cloud.y).toBeGreaterThanOrEqual(0)
    expect(cloud.y).toBeLessThanOrEqual(100)
  })

  it('should be a white rectangle with correct dimensions', () => {
    const cloud = new Cloud(scene, 800, 50)
    expect(cloud.width).toBe(98)
    expect(cloud.height).toBe(32)
    expect(cloud.fillColor).toBe(0xffffff)
  })

  it('should be added to the scene', () => {
    const cloud = new Cloud(scene, 800, 50)
    expect(scene.add.existing).toHaveBeenCalledWith(cloud)
  })

  it('should have a random scale based on alpha', () => {
    const cloud = new Cloud(scene, 800, 50)
    expect(cloud.setScale).toHaveBeenCalled()

    // Scale should be 1, 0.5, or 0.333... (1/1, 1/2, or 1/3)
    const scaleValue = vi.mocked(cloud.setScale).mock.calls[0][0]
    expect(scaleValue).toBeGreaterThan(0)
    expect(scaleValue).toBeLessThanOrEqual(1)
  })

  it('should initialize tween animation on creation', () => {
    const cloud = new Cloud(scene, 800, 50)
    expect(scene.tweens.add).toHaveBeenCalled()

    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.targets).toBe(cloud)
  })

  it('should move from right to left', () => {
    const cloud = new Cloud(scene, 800, 50)
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.x).toEqual({ from: 800, to: -100 })
  })

  it('should have duration inversely proportional to scale', () => {
    const cloud = new Cloud(scene, 800, 50)
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]

    // Duration should be 2000 / scale
    expect(tweenConfig.duration).toBeGreaterThanOrEqual(2000)
  })

  it('should have onComplete callback that destroys the cloud', () => {
    const cloud = new Cloud(scene, 800, 50)
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.onComplete).toBeDefined()

    if (tweenConfig.onComplete) {
      tweenConfig.onComplete()
      expect(cloud.destroy).toHaveBeenCalled()
    }
  })
})
