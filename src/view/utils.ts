import { Scene } from "phaser";

export const loadAssetAsync = async (scene: Scene, func: Function) => {
  return new Promise((res) => {

    func();
    scene.load.on("complete", res);
    scene.load.start();
  });
};
