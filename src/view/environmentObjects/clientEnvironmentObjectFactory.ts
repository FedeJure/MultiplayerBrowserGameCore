import { Scene } from "phaser";
import { MapEnvironmentObject } from "../../domain/environment/mapEnvironmentObject";
import { EnvironmentObjectAssetType } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectFactory } from "../../domain/environmentObjects/environmentobjectFactory";
import { AssetLoader } from "../AssetLoader";
import { loadAssetAsync } from "../utils";
import { BaseEnvironmentObject } from "./baseEnvironmentObject";

export class ClientEnvironmentObjectFactory
  implements EnvironmentObjectFactory
{
  constructor(private scene: Scene) {}
  createObjects(objs: MapEnvironmentObject[]) {
    objs.map(async (ob) => {
      return loadAssetAsync(this.scene, () => {
        if (this.scene.textures.exists(ob.object.textureName)) return;
        if (!ob.object.atlasPath) {
          const config = AssetLoader.resolveSpineConfig(ob.object.textureName);
          this.scene.load.spine(config.key, config.jsonUrl, config.atlasUrl);
        }
      })
        .then(() => {
          if (ob.object.assetType === EnvironmentObjectAssetType.spine) { //Is spine
            const view = this.scene.add.spine(
              ob.position.x,
              ob.position.y,
              ob.object.textureName,
              "animation",
              true
            ) as unknown as Phaser.GameObjects.Sprite;
            view.setDisplaySize(ob.object.width, ob.object.height);
            view.setSize(ob.object.width, ob.object.height);
            const newPos = [view.x - view.width / 2, view.y - view.height / 2];
            view.setPosition(
              newPos[0] + view.width * ob.object.pivotOrigin.x,
              newPos[1] + view.height * ob.object.pivotOrigin.y
            );
            new BaseEnvironmentObject(this.scene, view);
          }
        })
        .catch(console.log);
    });
  }
}
