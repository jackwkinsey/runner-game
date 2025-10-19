import { describe, it, expect, beforeEach, vi } from 'vitest'
import Game from '../Game'
import Player from '../../entities/player'
import Generator from '../../entities/generator'

// Mock the entities
vi.mock('../../entities/player')
vi.mock('../../entities/generator')

describe('Game Scene', () => {
  let game: Game

  beforeEach(() => {
    vi.clearAllMocks()
    game = new Game()
  })

  describe('constructor', () => {
    it('should initialize with key "game"', () => {
      expect(game['key']).toBe('game')
    })

    it('should initialize player as null', () => {
      expect(game.player).toBeNull()
    })

    it('should initialize score as 0', () => {
      expect(game.score).toBe(0)
    })

    it('should initialize scoreText as null', () => {
      expect(game.scoreText).toBeNull()
    })
  })

  describe('init', () => {
    it('should set name and number from data', () => {
      const data = { name: 'Test Player', number: 42 }
      game.init(data)

      expect(game.name).toBe('Test Player')
      expect(game.number).toBe(42)
    })
  })

  describe('preload', () => {
    it('should set score in registry to 0', () => {
      game.preload()
      expect(game.registry.set).toHaveBeenCalledWith('score', 0)
    })

    it('should reset score to 0', () => {
      game.score = 100
      game.preload()
      expect(game.score).toBe(0)
    })

    it('should load all audio files', () => {
      game.preload()

      expect(game.load.audio).toHaveBeenCalledWith('coin', 'assets/sounds/coin.mp3')
      expect(game.load.audio).toHaveBeenCalledWith('jump', 'assets/sounds/jump.mp3')
      expect(game.load.audio).toHaveBeenCalledWith('dead', 'assets/sounds/dead.mp3')
      expect(game.load.audio).toHaveBeenCalledWith('theme', 'assets/sounds/theme.mp3')
    })

    it('should load coin spritesheet', () => {
      game.preload()

      expect(game.load.spritesheet).toHaveBeenCalledWith('coin', 'assets/images/coin.png', {
        frameWidth: 32,
        frameHeight: 32,
      })
    })

    it('should load bitmap font', () => {
      game.preload()

      expect(game.load.bitmapFont).toHaveBeenCalledWith('arcade', 'assets/fonts/arcade.png', 'assets/fonts/arcade.xml')
    })
  })

  describe('create', () => {
    beforeEach(() => {
      game.create()
    })

    it('should set width and height from config', () => {
      expect(game.width).toBe(800)
      expect(game.height).toBe(600)
    })

    it('should calculate center_width and center_height', () => {
      expect(game.center_width).toBe(400)
      expect(game.center_height).toBe(300)
    })

    it('should set camera background color to sky blue', () => {
      expect(game.cameras.main.setBackgroundColor).toHaveBeenCalledWith(0x87ceeb)
    })

    it('should create obstacles group', () => {
      expect(game.add.group).toHaveBeenCalled()
      expect(game.obstacles).toBeDefined()
    })

    it('should create coins group', () => {
      expect(game.add.group).toHaveBeenCalled()
      expect(game.coins).toBeDefined()
    })

    it('should create generator', () => {
      expect(game.generator).toBeInstanceOf(Generator)
    })

    it('should add SPACE key', () => {
      expect(game.input.keyboard!.addKey).toHaveBeenCalledWith(Phaser.Input.Keyboard.KeyCodes.SPACE)
    })

    it('should create player at correct position', () => {
      expect(Player).toHaveBeenCalledWith(game, 300, 400)
    })

    it('should create score text', () => {
      expect(game.add.bitmapText).toHaveBeenCalledWith(400, 10, 'arcade', '0', 20)
    })

    it('should add collider between player and obstacles', () => {
      expect(game.physics.add.collider).toHaveBeenCalledWith(
        game.player,
        game.obstacles,
        game.hitObstacle,
        expect.any(Function),
        game
      )
    })

    it('should add overlap between player and coins', () => {
      expect(game.physics.add.overlap).toHaveBeenCalledWith(
        game.player,
        game.coins,
        game.hitCoin,
        expect.any(Function),
        game
      )
    })

    it('should listen to pointerdown event', () => {
      expect(game.input.on).toHaveBeenCalledWith('pointerdown', game.jump, game)
    })

    it('should create updateScoreEvent timer', () => {
      expect(game.time.addEvent).toHaveBeenCalledWith({
        delay: 100,
        callback: expect.any(Function),
        callbackScope: game,
        loop: true,
      })
      expect(game.updateScoreEvent).toBeDefined()
    })
  })

  describe('hitObstacle', () => {
    beforeEach(() => {
      game.create()
    })

    it('should destroy updateScoreEvent', () => {
      const destroySpy = vi.fn()
      game.updateScoreEvent = { destroy: destroySpy } as any

      game.hitObstacle()

      expect(destroySpy).toHaveBeenCalled()
    })

    it('should call finishScene', () => {
      vi.spyOn(game, 'finishScene')
      game.hitObstacle()

      expect(game.finishScene).toHaveBeenCalled()
    })
  })

  describe('hitCoin', () => {
    beforeEach(() => {
      game.create()
      game.loadAudios()
    })

    it('should play coin audio', () => {
      const mockCoin = { destroy: vi.fn() }
      vi.spyOn(game, 'playAudio')

      game.hitCoin(null, mockCoin)

      expect(game.playAudio).toHaveBeenCalledWith('coin')
    })

    it('should update score by 1000 points', () => {
      const mockCoin = { destroy: vi.fn() }
      vi.spyOn(game, 'updateScore')

      game.hitCoin(null, mockCoin)

      expect(game.updateScore).toHaveBeenCalledWith(1000)
    })

    it('should destroy the coin', () => {
      const mockCoin = { destroy: vi.fn() }

      game.hitCoin(null, mockCoin)

      expect(mockCoin.destroy).toHaveBeenCalled()
    })
  })

  describe('loadAudios', () => {
    beforeEach(() => {
      game.loadAudios()
    })

    it('should load all game audio objects', () => {
      expect(game.audios).toBeDefined()
      expect(game.audios.jump).toBeDefined()
      expect(game.audios.coin).toBeDefined()
      expect(game.audios.dead).toBeDefined()
    })

    it('should add audio with correct keys', () => {
      expect(game.sound.add).toHaveBeenCalledWith('jump')
      expect(game.sound.add).toHaveBeenCalledWith('coin')
      expect(game.sound.add).toHaveBeenCalledWith('dead')
    })
  })

  describe('playAudio', () => {
    beforeEach(() => {
      game.loadAudios()
    })

    it('should play the specified audio', () => {
      const jumpSpy = vi.spyOn(game.audios.jump, 'play')

      game.playAudio('jump')

      expect(jumpSpy).toHaveBeenCalled()
    })

    it('should play coin audio when key is coin', () => {
      const coinSpy = vi.spyOn(game.audios.coin, 'play')

      game.playAudio('coin')

      expect(coinSpy).toHaveBeenCalled()
    })
  })

  describe('playMusic', () => {
    it('should add theme audio', () => {
      game.playMusic()

      expect(game.sound.add).toHaveBeenCalledWith('theme')
    })

    it('should stop theme before playing', () => {
      game.playMusic()

      expect(game.theme.stop).toHaveBeenCalled()
    })

    it('should play theme with correct config', () => {
      game.playMusic()

      expect(game.theme.play).toHaveBeenCalledWith({
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      })
    })

    it('should support custom theme key', () => {
      game.playMusic('custom-theme')

      expect(game.sound.add).toHaveBeenCalledWith('custom-theme')
    })
  })

  describe('update', () => {
    beforeEach(() => {
      game.create()
      game.player = {
        body: {
          blocked: { down: false },
          setVelocityY: vi.fn(),
        },
        rotation: 0,
      } as any
    })

    it('should call jump when SPACE key is just pressed', () => {
      game.player!.body.blocked.down = true
      vi.spyOn(game, 'jump')
      vi.mocked(Phaser.Input.Keyboard.JustDown).mockReturnValue(true)

      game.update()

      expect(game.jump).toHaveBeenCalled()
    })

    it('should stop jump tween when player is on ground', () => {
      game.player!.body.blocked.down = true
      game.jumpTween = { stop: vi.fn() } as any
      game.player!.rotation = 45

      vi.mocked(Phaser.Input.Keyboard.JustDown).mockReturnValue(false)

      game.update()

      expect(game.jumpTween.stop).toHaveBeenCalled()
      expect(game.player!.rotation).toBe(0)
    })
  })

  describe('jump', () => {
    beforeEach(() => {
      game.create()
      game.loadAudios()
      game.player = {
        body: {
          blocked: { down: false },
          setVelocityY: vi.fn(),
        },
        rotation: 0,
      } as any
    })

    it('should not jump if player is not on ground', () => {
      game.player!.body.blocked.down = false

      game.jump()

      expect(game.player!.body.setVelocityY).not.toHaveBeenCalled()
    })

    it('should set velocity to -300 when jumping', () => {
      game.player!.body.blocked.down = true

      game.jump()

      expect(game.player!.body.setVelocityY).toHaveBeenCalledWith(-300)
    })

    it('should play jump audio', () => {
      game.player!.body.blocked.down = true
      vi.spyOn(game, 'playAudio')

      game.jump()

      expect(game.playAudio).toHaveBeenCalledWith('jump')
    })

    it('should create rotation tween', () => {
      game.player!.body.blocked.down = true

      game.jump()

      expect(game.tweens.add).toHaveBeenCalledWith({
        targets: game.player,
        duration: 1000,
        angle: { from: 0, to: 360 },
        repeat: -1,
      })
    })
  })

  describe('finishScene', () => {
    beforeEach(() => {
      game.create()
      game.loadAudios()
      game.playMusic()
    })

    it('should stop theme music', () => {
      vi.spyOn(game.theme, 'stop')

      game.finishScene()

      expect(game.theme.stop).toHaveBeenCalled()
    })

    it('should play dead audio', () => {
      vi.spyOn(game, 'playAudio')

      game.finishScene()

      expect(game.playAudio).toHaveBeenCalledWith('dead')
    })

    it('should set score in registry', () => {
      game.score = 1234

      game.finishScene()

      expect(game.registry.set).toHaveBeenCalledWith('score', '1234')
    })

    it('should start gameover scene', () => {
      game.finishScene()

      expect(game.scene.start).toHaveBeenCalledWith('gameover')
    })
  })

  describe('updateScore', () => {
    beforeEach(() => {
      game.create()
      game.score = 100
    })

    it('should increase score by 1 by default', () => {
      game.updateScore()

      expect(game.score).toBe(101)
    })

    it('should increase score by specified points', () => {
      game.updateScore(1000)

      expect(game.score).toBe(1100)
    })

    it('should update score text', () => {
      game.updateScore(50)

      expect(game.scoreText!.setText).toHaveBeenCalledWith('150')
    })
  })
})
