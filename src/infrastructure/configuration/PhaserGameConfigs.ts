import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";

const scaleOptions = {
  mode: Phaser.Scale.ScaleModes.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  // min: {
  //   width: 512,
  //   height: 576,
  // },
  // max: {
  //   width: 1366,
  //   height: 768,
  // },
  width: 1366,
  height: 768,
  orientation: Phaser.Scale.Orientation.PORTRAIT,
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
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
      },
      debug: true
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
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
      },
    },
  },
};
