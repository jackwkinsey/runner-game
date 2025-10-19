# Test Suite Documentation

## Overview

This project includes a comprehensive test suite for the Phaser runner game. The tests cover all entities, game scenes, and core game logic using Vitest as the testing framework.

## Test Structure

```
src/
├── game/
│   ├── entities/
│   │   ├── __tests__/
│   │   │   ├── player.test.ts
│   │   │   ├── obstacle.test.ts
│   │   │   ├── coin.test.ts
│   │   │   ├── cloud.test.ts
│   │   │   └── generator.test.ts
│   └── scenes/
│       └── __tests__/
│           ├── Game.test.ts
│           └── GameOver.test.ts
└── test/
    └── setup.ts
```

## Running Tests

### Run Tests in Watch Mode

```bash
pnpm test
```

### Run Tests Once

```bash
pnpm run test:run
```

### Run Tests with UI

```bash
pnpm run test:ui
```

### Run Tests with Coverage

```bash
pnpm run test:coverage
```

## Test Coverage

### Entities (37 tests)

#### Player Entity (9 tests)

- ✓ Creates player at specified position
- ✓ Uses correct dimensions and color
- ✓ Initializes with default properties (jumping, invincible, health)
- ✓ Configures physics body correctly
- ✓ Sets up collision with world bounds

#### Obstacle Entity (8 tests)

- ✓ Creates obstacle at specified position
- ✓ Uses correct dimensions and color
- ✓ Disables gravity
- ✓ Animates movement from right to left
- ✓ Destroys itself after animation completes

#### Coin Entity (11 tests)

- ✓ Creates coin at specified position
- ✓ Uses correct texture
- ✓ Disables gravity
- ✓ Animates movement from right to left
- ✓ Creates and plays coin animation
- ✓ Reuses existing animation if available

#### Cloud Entity (9 tests)

- ✓ Creates cloud at specified position
- ✓ Generates random Y position when needed
- ✓ Uses correct dimensions and color
- ✓ Applies random scale/alpha
- ✓ Animates at speed proportional to scale

### Generator Entity (11 tests)

- ✓ Stores reference to scene
- ✓ Schedules initialization
- ✓ Generates clouds, obstacles, and coins
- ✓ Creates objects at correct positions
- ✓ Schedules next generation with random delays

### Game Scene (49 tests)

#### Initialization

- ✓ Initializes with correct key and default values
- ✓ Loads all assets (audio, sprites, fonts)
- ✓ Sets up game dimensions and camera

#### Game Objects

- ✓ Creates player, obstacles, and coins groups
- ✓ Creates generator
- ✓ Sets up score display

#### Physics & Collisions

- ✓ Configures collision between player and obstacles
- ✓ Configures overlap between player and coins
- ✓ Handles collision callbacks correctly

#### Input

- ✓ Listens for SPACE key
- ✓ Listens for pointer/touch events
- ✓ Triggers jump on input

#### Audio

- ✓ Loads and plays sound effects
- ✓ Plays theme music with correct settings
- ✓ Stops music on game over

#### Game Logic

- ✓ Updates score over time
- ✓ Awards bonus points for coins
- ✓ Handles game over correctly
- ✓ Transitions to game over scene

#### Player Actions

- ✓ Jump mechanics (velocity, rotation)
- ✓ Ground detection
- ✓ Jump tween animation

### GameOver Scene (14 tests)

#### Display

- ✓ Shows final score
- ✓ Displays "GAME OVER" text
- ✓ Shows restart instructions

#### Input

- ✓ Listens for SPACE key to restart
- ✓ Listens for pointer/touch to restart
- ✓ Restarts game on input

#### Configuration

- ✓ Handles numeric and string dimensions
- ✓ Calculates center positions correctly

## Test Configuration

### vitest.config.ts

- Uses jsdom environment for browser-like testing
- Configures coverage reporting
- Excludes test files and config from coverage

### src/test/setup.ts

- Mocks Phaser globally for testing
- Provides mock implementations of Phaser classes
- Sets up canvas mocking for browser APIs

## Writing New Tests

When adding new entities or scenes:

1. Create a `__tests__` directory next to the source file
2. Name the test file `[filename].test.ts`
3. Import necessary testing utilities from vitest
4. Use the existing mocks from `src/test/setup.ts`
5. Follow the existing test structure for consistency

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MyEntity from '../my-entity'

describe('MyEntity', () => {
  let scene: Phaser.Scene
  let entity: MyEntity

  beforeEach(() => {
    scene = new Phaser.Scene()
    entity = new MyEntity(scene, 100, 200)
  })

  it('should create entity at specified position', () => {
    expect(entity.x).toBe(100)
    expect(entity.y).toBe(200)
  })
})
```

## Continuous Integration

The test suite is ready for CI/CD integration. Use `npm run test:run` in your CI pipeline to run all tests in non-watch mode.

## Troubleshooting

### Canvas/WebGL Errors

If you see canvas-related errors, ensure `src/test/setup.ts` is properly configured in `vitest.config.ts` as a setup file.

### Import Errors

Make sure all Phaser-related imports use the global mock or are properly mocked in individual test files.

### Mock Updates

If Phaser APIs are updated, you may need to update the mocks in `src/test/setup.ts` accordingly.

## Dependencies

- **vitest**: Testing framework
- **jsdom**: Browser environment simulation
- **@vitest/ui**: Optional UI for test visualization
- **happy-dom**: Alternative DOM implementation

## Benefits

✅ **Confidence**: Catch bugs before they reach production
✅ **Documentation**: Tests serve as living documentation
✅ **Refactoring**: Safely refactor code with test coverage
✅ **Regression Prevention**: Prevent old bugs from returning
✅ **Fast Feedback**: Quick test execution in watch mode
