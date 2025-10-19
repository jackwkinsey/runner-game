import GameOver from './scenes/GameOver'
import MainGame from './scenes/Game'
import { AUTO, Game } from 'phaser'

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 600,
  height: 300,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 350 },
      // debug: true,
    },
  },
  backgroundColor: '#028af8',
  scene: [MainGame, GameOver],
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame
