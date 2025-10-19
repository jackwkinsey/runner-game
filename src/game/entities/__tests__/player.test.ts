import { describe, it, expect, beforeEach, vi } from 'vitest'
import Player from '../player'

describe('Player', () => {
  let scene: Phaser.Scene
  let player: Player

  beforeEach(() => {
    scene = new Phaser.Scene()
    player = new Player(scene, 100, 200)
  })

  it('should create a player at the specified position', () => {
    expect(player.x).toBe(100)
    expect(player.y).toBe(200)
  })

  it('should be a green rectangle with correct dimensions', () => {
    expect(player.width).toBe(32)
    expect(player.height).toBe(32)
    expect(player.fillColor).toBe(0x00ff00)
  })

  it('should initialize with correct default properties', () => {
    expect(player.jumping).toBe(false)
    expect(player.invincible).toBe(false)
    expect(player.health).toBe(10)
  })

  it('should have physics body with correct configuration', () => {
    expect(player.body).toBeDefined()
    expect(player.body.collideWorldBounds).toBe(true)
    expect(player.body.mass).toBe(10)
  })

  it('should be added to the scene', () => {
    expect(scene.add.existing).toHaveBeenCalledWith(player)
  })

  it('should have physics enabled', () => {
    expect(scene.physics.add.existing).toHaveBeenCalledWith(player)
  })

  it('should have origin set to center', () => {
    expect(player.setOrigin).toHaveBeenCalledWith(0.5)
  })

  it('should have scale set to 1', () => {
    expect(player.setScale).toHaveBeenCalledWith(1)
  })

  it('should have drag Y set to 10', () => {
    expect(player.body.setDragY).toHaveBeenCalledWith(10)
  })
})
