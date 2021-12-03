import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin"

export const ClientConfig: GameConfig = {
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
        showBody: false,
        showStaticBody: false,
      },
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

export const ServerConfig: GameConfig = {
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
