import { Scene } from "phaser";
import { AssetLoader } from "../../view/AssetLoader";
import { ProcessedMap } from "../environment/processedMap";

export async function loadMapAssets(
  map: ProcessedMap,
  scene: Scene
) {
  return new Promise((res, _) => {

    scene.load.image({
      key: map.config.objectsSourceFile.key,
      url: AssetLoader.resolveAssetPath(map.config.objectsSourceFile.fileName),
    });
    scene.load.image({
      key: map.config.tilesSourceFiles.key,
      url: AssetLoader.resolveAssetPath(map.config.tilesSourceFiles.fileName),
    });
    scene.load.tilemapTiledJSON({
      key: map.config.jsonFile.key,
      url: AssetLoader.resolveAssetPath(map.config.jsonFile.fileName),
    });
    scene.load.on("complete", res);
    scene.load.start();
  });
}