import { Scene } from "phaser";
import { AssetLoader } from "../../view/AssetLoader";
import { ProcessedMap } from "../environment/processedMap";

export async function loadMapAssets(map: ProcessedMap, scene: Scene) {
  return new Promise((res, _) => {
    map.config.sourceFiles.forEach((sourceFile) => {
      scene.load.image({
        key: sourceFile.key,
        url: AssetLoader.resolveAssetPath(sourceFile.fileName),
      });
    });
    scene.load.tilemapTiledJSON({
      key: map.config.jsonFile.key,
      url: AssetLoader.resolveAssetPath(map.config.jsonFile.fileName),
    });
    map.config.mapAtlases.forEach(({ key, jsonFileName, textureFileName }) => {
      scene.load.atlas(
        key,
        AssetLoader.resolveAssetPath(textureFileName),
        AssetLoader.resolveAssetPath(jsonFileName)
      );
    });

    scene.load.json(
      map.config.jsonFile.key,
      AssetLoader.resolveAssetPath(map.config.mapObjects.fileName)
    );
    scene.load.on("complete", res);
    scene.load.start();
  });
}
