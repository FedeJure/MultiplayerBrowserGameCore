import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";

const scaleOptions = {
  mode: Phaser.Scale.RESIZE,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  min: {
    width: 1024,
    height: 576,
  },
  max: {
    width: 1366,
    height: 768,
  },

  zoom: 1,
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
