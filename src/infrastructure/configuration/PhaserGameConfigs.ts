import { GameConfig } from "../../view/gameConfig";
import "phaser/plugins/spine/dist/SpinePlugin";

export const PhaserClientConfig: GameConfig = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  disableContextMenu: true,
  version: "v0.0.1",
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoFocus: true,
  roundPixels: true,
  pixelArt: false,
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
      },
      fps: 60,
      fixedStep: true,
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
    height: 10,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1300,
        
      },
      fixedStep: true,
      fps: 30
    },
  },
};
