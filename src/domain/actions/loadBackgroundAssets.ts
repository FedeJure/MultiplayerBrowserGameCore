import { Scene } from "phaser";
import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { ProcessedMap } from "../environment/processedMap";

export async function loadBackgroundAssets(
  originUrl: string,
  map: ProcessedMap,
  scene: Scene
) {
  return new Promise((res, _) => {
    map.config.backgroundFile.forEach((bg) => {
      scene.load.image({
        key: bg.key,
        url: `${originUrl}${DefaultGameConfiguration.assetsPath}${bg.fileName}`,
      });
    });

    scene.load.on("complete", res);
    scene.load.start();
  });
}
