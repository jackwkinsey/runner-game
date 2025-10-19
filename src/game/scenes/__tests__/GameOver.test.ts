import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Phaser before importing GameOver
vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {
      key: string
      constructor(config?: any) {
        this.key = config?.key
      }
    },
  },
}))

import GameOver from '../GameOver'

describe('GameOver Scene', () => {
  let gameOver: GameOver

  beforeEach(() => {
    vi.clearAllMocks()
    gameOver = new GameOver()

    // Initialize Phaser Scene properties
    gameOver.sys = {
      game: {
        config: {
          width: 800,
          height: 600,
        },
      },
    } as any

    gameOver.cameras = {
      main: {
        setBackgroundColor: vi.fn(),
      },
    } as any

    gameOver.add = {
      bitmapText: vi.fn((x, y, font, text, size) => ({
        setOrigin: vi.fn().mockReturnThis(),
        x,
        y,
        text,
      })),
    } as any

    gameOver.registry = {
      get: vi.fn().mockReturnValue('12345'),
      set: vi.fn(),
    } as any

    gameOver.input = {
      keyboard: {
        on: vi.fn(),
      },
      on: vi.fn(),
    } as any

    gameOver.scene = {
      start: vi.fn(),
    } as any
  })

  describe('constructor', () => {
    it('should initialize with key "gameover"', () => {
      expect(gameOver['key']).toBe('gameover')
    })
  })

  describe('create', () => {
    beforeEach(() => {
      gameOver.create()
    })

    it('should set width and height from config', () => {
      expect(gameOver.width).toBe(800)
      expect(gameOver.height).toBe(600)
    })

    it('should calculate center_width and center_height', () => {
      expect(gameOver.center_width).toBe(400)
      expect(gameOver.center_height).toBe(300)
    })

    it('should set camera background color to sky blue', () => {
      expect(gameOver.cameras.main.setBackgroundColor).toHaveBeenCalledWith(0x87ceeb)
    })

    it('should retrieve score from registry', () => {
      expect(gameOver.registry.get).toHaveBeenCalledWith('score')
    })

    it('should display score at top center', () => {
      expect(gameOver.add.bitmapText).toHaveBeenCalledWith(400, 50, 'arcade', '12345', 25)
    })

    it('should display GAME OVER text at center', () => {
      const calls = vi.mocked(gameOver.add.bitmapText).mock.calls
      const gameOverCall = calls.find((call) => call[3] === 'GAME OVER')

      expect(gameOverCall).toBeDefined()
      expect(gameOverCall![0]).toBe(400)
      expect(gameOverCall![1]).toBe(300)
      expect(gameOverCall![2]).toBe('arcade')
      expect(gameOverCall![4]).toBe(45)
    })

    it('should display restart instruction', () => {
      const calls = vi.mocked(gameOver.add.bitmapText).mock.calls
      const instructionCall = calls.find((call) => call[3]?.includes('Press SPACE'))

      expect(instructionCall).toBeDefined()
      expect(instructionCall![0]).toBe(400)
      expect(instructionCall![1]).toBe(250)
      expect(instructionCall![2]).toBe('arcade')
      expect(instructionCall![3]).toBe('Press SPACE or click to restart!')
      expect(instructionCall![4]).toBe(15)
    })

    it('should set all text elements to center origin', () => {
      const bitmapTextCalls = vi.mocked(gameOver.add.bitmapText).mock.calls

      // Each bitmapText call should return an object with setOrigin
      expect(bitmapTextCalls.length).toBe(3)
    })

    it('should listen for SPACE key press', () => {
      expect(gameOver.input.keyboard?.on).toHaveBeenCalledWith('keydown-SPACE', gameOver.startGame, gameOver)
    })

    it('should listen for pointer click', () => {
      expect(gameOver.input.on).toHaveBeenCalledWith('pointerdown', gameOver.startGame, gameOver)
    })
  })

  describe('startGame', () => {
    beforeEach(() => {
      gameOver.create()
    })

    it('should start the game scene', () => {
      gameOver.startGame()

      expect(gameOver.scene.start).toHaveBeenCalledWith('game')
    })
  })

  describe('width and height parsing', () => {
    it('should handle numeric width and height', () => {
      const customGameOver = new GameOver()
      customGameOver.sys = {
        game: {
          config: {
            width: 1024,
            height: 768,
          },
        },
      } as any
      customGameOver.cameras = {
        main: {
          setBackgroundColor: vi.fn(),
        },
      } as any
      customGameOver.add = {
        bitmapText: vi.fn((x, y, font, text, size) => ({
          setOrigin: vi.fn().mockReturnThis(),
        })),
      } as any
      customGameOver.registry = {
        get: vi.fn().mockReturnValue('12345'),
      } as any
      customGameOver.input = {
        keyboard: {
          on: vi.fn(),
        },
        on: vi.fn(),
      } as any
      customGameOver.scene = {
        start: vi.fn(),
      } as any

      customGameOver.create()

      expect(customGameOver.width).toBe(1024)
      expect(customGameOver.height).toBe(768)
    })

    it('should handle string width and height', () => {
      const customGameOver = new GameOver()
      customGameOver.sys = {
        game: {
          config: {
            width: '1024' as any,
            height: '768' as any,
          },
        },
      } as any
      customGameOver.cameras = {
        main: {
          setBackgroundColor: vi.fn(),
        },
      } as any
      customGameOver.add = {
        bitmapText: vi.fn((x, y, font, text, size) => ({
          setOrigin: vi.fn().mockReturnThis(),
        })),
      } as any
      customGameOver.registry = {
        get: vi.fn().mockReturnValue('12345'),
      } as any
      customGameOver.input = {
        keyboard: {
          on: vi.fn(),
        },
        on: vi.fn(),
      } as any
      customGameOver.scene = {
        start: vi.fn(),
      } as any

      customGameOver.create()

      expect(customGameOver.width).toBe(1024)
      expect(customGameOver.height).toBe(768)
    })
  })
})
