import { Scene } from "phaser";
import { AssetLoader } from "../../view/AssetLoader";
import { ProcessedMap } from "../environment/processedMap";

export async function loadMapAssets(
  map: ProcessedMap,
  scene: Scene
) {
  return new Promise((res, _) => {
    map.config.sourceFiles.forEach(sourceFile => {
      scene.load.image({
        key: sourceFile.key,
        url: AssetLoader.resolveAssetPath(sourceFile.fileName),
      });
    })
    scene.load.tilemapTiledJSON({
      key: map.config.jsonFile.key,
      url: AssetLoader.resolveAssetPath(map.config.jsonFile.fileName),
    });
    scene.load.on("complete", res);
    scene.load.start();
  });
}