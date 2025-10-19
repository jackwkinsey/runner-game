import { describe, it, expect, beforeEach, vi } from 'vitest'
import Generator from '../generator'
import Game from '../../scenes/Game'
import Cloud from '../cloud'
import Obstacle from '../obstacle'
import Coin from '../coin'

// Mock the entity classes
vi.mock('../cloud', () => ({
  default: vi.fn(),
}))

vi.mock('../obstacle', () => ({
  default: vi.fn(),
}))

vi.mock('../coin', () => ({
  default: vi.fn(),
}))

describe('Generator', () => {
  let scene: Game
  let generator: Generator

  beforeEach(() => {
    scene = new Game() as any
    scene.height = 600
    scene.obstacles = {
      add: vi.fn(),
    } as any
    scene.coins = {
      add: vi.fn(),
    } as any

    // Mock Phaser.Math.Between to return predictable values
    vi.spyOn(Phaser.Math, 'Between').mockReturnValue(100)

    generator = new Generator(scene)
  })

  it('should store a reference to the scene', () => {
    expect(generator.scene).toBe(scene)
  })

  it('should schedule init to be called after 2000ms', () => {
    expect(scene.time.delayedCall).toHaveBeenCalledWith(2000, expect.any(Function), [], generator)
  })

  it('should call all generate methods when init is invoked', () => {
    vi.spyOn(generator, 'generateCloud')
    vi.spyOn(generator, 'generateObstacle')
    vi.spyOn(generator, 'generateCoin')

    generator.init()

    expect(generator.generateCloud).toHaveBeenCalled()
    expect(generator.generateObstacle).toHaveBeenCalled()
    expect(generator.generateCoin).toHaveBeenCalled()
  })

  describe('generateCloud', () => {
    it('should create a new cloud', () => {
      vi.mocked(Cloud).mockClear()
      generator.generateCloud()

      // Verify a cloud was created with expected parameters
      expect(Cloud).toHaveBeenCalledWith(scene, 800, 0)
    })

    it('should schedule next cloud generation with random delay', () => {
      // Mock Phaser.Math.Between to return random values
      let callCount = 0
      vi.spyOn(Phaser.Math, 'Between').mockImplementation((min, max) => {
        callCount++
        // Return a value in the 2000-3000 range for the delay
        if (callCount === 1) return 2500
        return 100
      })

      vi.mocked(scene.time.delayedCall).mockClear()

      generator.generateCloud()

      expect(scene.time.delayedCall).toHaveBeenCalledWith(expect.any(Number), expect.any(Function), [], generator)

      // Verify the delay is within expected range (2000-3000)
      const delay = vi.mocked(scene.time.delayedCall).mock.calls[0][0]
      expect(delay).toBeGreaterThanOrEqual(2000)
      expect(delay).toBeLessThanOrEqual(3000)
    })
  })

  describe('generateObstacle', () => {
    it('should create a new obstacle and add it to the obstacles group', () => {
      vi.mocked(Obstacle).mockClear()
      generator.generateObstacle()

      expect(Obstacle).toHaveBeenCalled()
      expect(scene.obstacles.add).toHaveBeenCalled()
    })

    it('should create obstacle at x=800 with random y position', () => {
      vi.mocked(Obstacle).mockClear()

      generator.generateObstacle()

      // Check that Obstacle was called with correct x coordinate
      const obstacleCall = vi.mocked(Obstacle).mock.calls[0]
      expect(obstacleCall[1]).toBe(800)

      // Y should be scene.height - random value
      expect(obstacleCall[2]).toBe(scene.height - 100)
    })

    it('should schedule next obstacle generation with random delay', () => {
      // Mock Phaser.Math.Between to return values in range
      let callCount = 0
      vi.spyOn(Phaser.Math, 'Between').mockImplementation((min, max) => {
        callCount++
        if (callCount === 1) return 100 // for y position
        return 2000 // for delay
      })

      vi.mocked(scene.time.delayedCall).mockClear()

      generator.generateObstacle()

      expect(scene.time.delayedCall).toHaveBeenCalled()

      // Verify the delay is within expected range (1500-2500)
      const delay = vi.mocked(scene.time.delayedCall).mock.calls[0][0]
      expect(delay).toBeGreaterThanOrEqual(1500)
      expect(delay).toBeLessThanOrEqual(2500)
    })
  })

  describe('generateCoin', () => {
    it('should create a new coin and add it to the coins group', () => {
      vi.mocked(Coin).mockClear()
      generator.generateCoin()

      expect(Coin).toHaveBeenCalled()
      expect(scene.coins.add).toHaveBeenCalled()
    })

    it('should create coin at x=800 with random y position', () => {
      vi.mocked(Coin).mockClear()

      generator.generateCoin()

      // Check that Coin was called with correct x coordinate
      const coinCall = vi.mocked(Coin).mock.calls[0]
      expect(coinCall[1]).toBe(800)

      // Y should be scene.height - random value
      expect(coinCall[2]).toBe(scene.height - 100)
    })

    it('should schedule next coin generation with random delay', () => {
      // Mock Phaser.Math.Between to return values in range
      let callCount = 0
      vi.spyOn(Phaser.Math, 'Between').mockImplementation((min, max) => {
        callCount++
        if (callCount === 1) return 100 // for y position
        return 1000 // for delay
      })

      vi.mocked(scene.time.delayedCall).mockClear()

      generator.generateCoin()

      expect(scene.time.delayedCall).toHaveBeenCalled()

      // Verify the delay is within expected range (500-1500)
      const delay = vi.mocked(scene.time.delayedCall).mock.calls[0][0]
      expect(delay).toBeGreaterThanOrEqual(500)
      expect(delay).toBeLessThanOrEqual(1500)
    })
  })
})
