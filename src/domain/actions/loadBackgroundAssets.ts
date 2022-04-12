import { Scene } from "phaser";
import { AssetLoader } from "../../view/AssetLoader";
import { ProcessedMap } from "../environment/processedMap";

export async function loadBackgroundAssets(
  map: ProcessedMap,
  scene: Scene
) {
  return new Promise((res, _) => {
    map.config.backgroundFile.forEach((bg) => {

      scene.load.image({
        key: bg.key,
        url: AssetLoader.resolveAssetPath(bg.fileName),
      });
    });

    scene.load.on("complete", res);
    scene.load.start();
  });
}
