import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin"

export const PhaserClientConfig: GameConfig = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 600,
  autoFocus: true,
  fps: {
    min: 60,
    forceSetTimeOut: true,
    target: 60
  },
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravity: {
        y: 1,
      },
      debug: {
        showBody: true,
        showCollisions: true
      }

    },
  },
  plugins: {
    scene: [
      {
        key: "SpinePlugin",
        plugin: window.SpinePlugin,
        mapping: 'spine'
      }
    ]
  },
};

export const PhaserServerConfig: GameConfig = {
  type: Phaser.HEADLESS,
  parent: "gameContainer",
  width: 800,
  height: 600,
  autoFocus: true,
  fps: {
    min: 60,
    forceSetTimeOut: true,
    target: 60
  },
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravity: {
        y: 1,
      },
      debug: {
        showBody: false,
        showStaticBody: false,
      },
    },
  },
};
