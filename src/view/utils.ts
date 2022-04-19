import { Scene } from "phaser";

export const loadAssetAsync = async (scene: Scene, func: () => boolean) => {
  return new Promise((res) => {

    const response = func();
    if (!response) {
      res(false)
      return
    }
    scene.load.on("complete", res);
    scene.load.start();
  });
};
