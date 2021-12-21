import { Scene } from "phaser";
import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { ProcessedMap } from "../environment/processedMap";

export async function loadMapAssets(originUrl: string, map: ProcessedMap, scene: Scene) {
  return new Promise((res, _) => {
    scene.load.image({
      key: map.config.backgroundFile.key,
      url: `${originUrl}${DefaultGameConfiguration.getMapRootPath(
        map.id,
        map.layerId
      )}${map.config.backgroundFile.fileName}`,
    });
    scene.load.image({
      key: map.config.objectsSourceFile.key,
      url: `${originUrl}${DefaultGameConfiguration.getMapRootPath(
        map.id,
        map.layerId
      )}${map.config.objectsSourceFile.fileName}`,
    });
    scene.load.image({
      key: map.config.tilesSourceFiles.key,
      url: `${originUrl}${DefaultGameConfiguration.getMapRootPath(
        map.id,
        map.layerId
      )}${map.config.tilesSourceFiles.fileName}`,
    });
    scene.load.tilemapTiledJSON({
      key: map.config.jsonFile.key,
      url: `${originUrl}${DefaultGameConfiguration.getMapRootPath(
        map.id,
        map.layerId
      )}${map.config.jsonFile.fileName}`,
    });
    scene.load.on("complete", res);
    scene.load.start();
  });
}
