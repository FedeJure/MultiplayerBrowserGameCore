import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";

const scaleOptions: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.ScaleModes.NONE,
  // autoCenter: Phaser.Scale.CENTER_BOTH,
  // min: {
  //   width: 512,
  //   height: 576,
  // },
  // max: {
  //   width: 1366,
  //   height: 768,
  // },
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 854,
  height: 480,
  zoom: 1.5
};

export const PhaserClientConfig: GameConfig = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  disableContextMenu: true,
  version: 'v0.0.1',
  desynchronized: true,
  scale: scaleOptions,
  autoFocus: true,
  fps: {
    min: 60,
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
  autoFocus: true,
  scale: {
    width: 10,
    height: 10
  },
  fps: {
    min: 60,
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
