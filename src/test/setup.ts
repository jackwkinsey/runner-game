import { vi } from 'vitest'

// Mock canvas before Phaser loads
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([255, 255, 255, 255]) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
  })) as any
}

// Mock Phaser globally
global.Phaser = {
  Scene: class MockScene {
    add: any
    physics: any
    tweens: any
    time: any
    anims: any
    input: any
    sound: any
    registry: any
    cameras: any
    sys: any
    scene: any
    load: any
    key: string

    constructor(config?: any) {
      this.key = config?.key
      this.add = {
        existing: vi.fn().mockReturnThis(),
        group: vi.fn(() => ({
          add: vi.fn(),
          children: { entries: [] },
        })),
        bitmapText: vi.fn((x, y, font, text, size) => ({
          setOrigin: vi.fn().mockReturnThis(),
          setText: vi.fn(),
          x,
          y,
          text,
        })),
      }
      this.load = {
        audio: vi.fn(),
        spritesheet: vi.fn(),
        bitmapFont: vi.fn(),
      }
      this.physics = {
        add: {
          existing: vi.fn().mockReturnThis(),
          collider: vi.fn(),
          overlap: vi.fn(),
        },
      }
      this.tweens = {
        add: vi.fn((config) => ({
          stop: vi.fn(),
          play: vi.fn(),
          pause: vi.fn(),
        })),
      }
      this.time = {
        addEvent: vi.fn((config) => ({
          destroy: vi.fn(),
          remove: vi.fn(),
        })),
        delayedCall: vi.fn(),
      }
      this.anims = {
        create: vi.fn(),
        get: vi.fn(),
        generateFrameNumbers: vi.fn(() => []),
      }
      this.input = {
        keyboard: {
          addKey: vi.fn(() => ({})),
          on: vi.fn(),
        },
        on: vi.fn(),
      }
      this.sound = {
        add: vi.fn(() => ({
          play: vi.fn(),
          stop: vi.fn(),
        })),
      }
      this.registry = {
        set: vi.fn(),
        get: vi.fn(),
      }
      this.cameras = {
        main: {
          setBackgroundColor: vi.fn(),
        },
      }
      this.sys = {
        game: {
          config: {
            width: 800,
            height: 600,
          },
        },
      }
      this.scene = {
        start: vi.fn(),
      }
    }
  },
  GameObjects: {
    Rectangle: class MockRectangle {
      scene: any
      x: number
      y: number
      width: number
      height: number
      fillColor: number
      body: any
      rotation: number
      scale: number

      constructor(scene: any, x: number, y: number, width: number, height: number, fillColor: number) {
        this.scene = scene
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.fillColor = fillColor
        this.rotation = 0
        this.scale = 1
        this.body = {
          collideWorldBounds: false,
          mass: 1,
          blocked: { down: false },
          setAllowGravity: vi.fn(),
          setVelocityY: vi.fn(),
          setDragY: vi.fn(),
        }
      }

      setOrigin = vi.fn().mockReturnThis()
      setScale = vi.fn((scale: number) => {
        this.scale = scale
        return this
      })
      destroy = vi.fn()
    },
    Sprite: class MockSprite {
      scene: any
      x: number
      y: number
      texture: string
      body: any
      rotation: number
      scale: number

      constructor(scene: any, x: number, y: number, texture: string) {
        this.scene = scene
        this.x = x
        this.y = y
        this.texture = texture
        this.rotation = 0
        this.scale = 1
        this.body = {
          collideWorldBounds: false,
          mass: 1,
          blocked: { down: false },
          setAllowGravity: vi.fn(),
          setVelocityY: vi.fn(),
        }
      }

      setOrigin = vi.fn().mockReturnThis()
      setScale = vi.fn((scale: number) => {
        this.scale = scale
        return this
      })
      play = vi.fn().mockReturnThis()
      destroy = vi.fn()
    },
    Group: class MockGroup {
      children: any[]
      constructor() {
        this.children = []
      }
      add = vi.fn((child: any) => {
        this.children.push(child)
        return child
      })
    },
  },
  Math: {
    Between: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min),
  },
  Input: {
    Keyboard: {
      KeyCodes: {
        SPACE: 32,
      },
      JustDown: vi.fn(() => false),
    },
  },
  Physics: {
    Arcade: {
      Body: class MockBody {
        collideWorldBounds: boolean = false
        mass: number = 1
        blocked = { down: false }
        setAllowGravity = vi.fn()
        setVelocityY = vi.fn()
        setDragY = vi.fn()
      },
    },
  },
} as any
