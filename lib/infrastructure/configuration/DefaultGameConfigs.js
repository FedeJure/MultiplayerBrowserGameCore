"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfig = exports.ClientConfig = void 0;
exports.ClientConfig = {
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
    }
};
exports.ServerConfig = {
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
    }
};
