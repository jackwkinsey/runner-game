import { describe, it, expect, beforeEach, vi } from 'vitest'
import Obstacle from '../obstacle'

describe('Obstacle', () => {
  let scene: Phaser.Scene
  let obstacle: Obstacle

  beforeEach(() => {
    scene = new Phaser.Scene()
    obstacle = new Obstacle(scene, 800, 300)
  })

  it('should create an obstacle at the specified position', () => {
    expect(obstacle.x).toBe(800)
    expect(obstacle.y).toBe(300)
  })

  it('should be a red rectangle with correct dimensions', () => {
    expect(obstacle.width).toBe(32)
    expect(obstacle.height).toBe(32)
    expect(obstacle.fillColor).toBe(0xff0000)
  })

  it('should be added to the scene', () => {
    expect(scene.add.existing).toHaveBeenCalledWith(obstacle)
  })

  it('should have physics enabled', () => {
    expect(scene.physics.add.existing).toHaveBeenCalledWith(obstacle)
  })

  it('should have gravity disabled', () => {
    expect(obstacle.body.setAllowGravity).toHaveBeenCalledWith(false)
  })

  it('should initialize tween animation on creation', () => {
    expect(scene.tweens.add).toHaveBeenCalled()

    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.targets).toBe(obstacle)
    expect(tweenConfig.duration).toBe(2000)
  })

  it('should move from right to left', () => {
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.x).toEqual({ from: 820, to: -100 })
  })

  it('should have onComplete callback that destroys the obstacle', () => {
    const tweenConfig = vi.mocked(scene.tweens.add).mock.calls[0][0]
    expect(tweenConfig.onComplete).toBeDefined()

    // Test that calling onComplete triggers destroy
    if (tweenConfig.onComplete) {
      tweenConfig.onComplete()
      expect(obstacle.destroy).toHaveBeenCalled()
    }
  })
})
