import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";
var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const gameHeight = 720
const gameWidth = 1280
const intendedZoom = clientWidth / gameWidth
const alternativeZoom = clientHeight / gameHeight
const useIntended = gameHeight * intendedZoom <= clientHeight
const scaleOptions: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.ScaleModes.NONE,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: gameWidth,
  height: gameHeight,
  zoom: useIntended ? intendedZoom : alternativeZoom,
};

export const PhaserClientConfig: GameConfig = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  disableContextMenu: true,
  version: 'v0.0.1',
  scale: scaleOptions,
  autoFocus: true,
  roundPixels: true,
  pixelArt: false,
  dom: {
    createContainer: true,
  },
  fps: {
    forceSetTimeOut: true,
    target: 60,
    smoothStep: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
      },
      // debug: true
    },
  },
  plugins: {
    scene: [
      {
        key: "SpinePlugin",
        plugin: window.SpinePlugin,
        mapping: "spine",
      },
    ],
  },
};

export const PhaserServerConfig: GameConfig = {
  type: Phaser.HEADLESS,
  parent: "gameContainer",
  autoFocus: true,
  scale: {
    width: 10,
    height: 10
  },
  customEnvironment: true,
  fps: {
    forceSetTimeOut: true,
    smoothStep: true,
    target: 60
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
      },
    },
  },
};
