import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";

const scaleOptions = {
  mode: Phaser.Scale.ScaleModes.RESIZE,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  min: {
    width: 512,
    height: 576,
  },
  max: {
    width: 1366,
    height: 768,
  },
};

export const PhaserClientConfig: GameConfig = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  scale: scaleOptions,
  autoFocus: true,
  fps: {
    min: 60,
    forceSetTimeOut: true,
    target: 60,
  },
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravity: {
        y: 1,
      },
      //debug: true
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
  scale: scaleOptions,
  autoFocus: true,
  fps: {
    min: 60,
    forceSetTimeOut: true,
    target: 60,
  },
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravity: {
        y: 1,
      },
    },
  },
};
