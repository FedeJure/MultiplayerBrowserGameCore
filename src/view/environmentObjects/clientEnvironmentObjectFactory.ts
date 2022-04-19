import { Scene } from "phaser";
import { MapEnvironmentObject } from "../../domain/environment/mapEnvironmentObject";
import { EnvironmentObjectAssetType } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectFactory } from "../../domain/environmentObjects/environmentObjectFactory";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { AssetLoader } from "../AssetLoader";
import { loadAssetAsync } from "../utils";

export class ClientEnvironmentObjectFactory
  implements EnvironmentObjectFactory
{
  constructor(
    private scene: Scene,
    private presenterProvider: ClientPresenterProvider | ServerPresenterProvider
  ) {}
  createObjects(objs: MapEnvironmentObject[]) {
    objs.map(async (ob) => {
      return loadAssetAsync(this.scene, () => {
        if (this.scene.textures.exists(ob.object.textureName)) return false;
        if (!ob.object.atlasPath) {
          const config = AssetLoader.resolveSpineConfig(ob.object.textureName);
          this.scene.load.spine(config.key, config.jsonUrl, config.atlasUrl);
          return true
        }
        return false
      })
        .then(() => {
          if (ob.object.assetType === EnvironmentObjectAssetType.spine) {
            let view = this.scene.add.spine(
              ob.position.x,
              ob.position.y,
              ob.object.textureName,
            ) as unknown as Phaser.GameObjects.Sprite;

            this.scene.matter.add.gameObject(view as Phaser.GameObjects.GameObject, {
              ignoreGravity: true,
              isStatic: true,
            })

            view.setDisplaySize(ob.object.width, ob.object.height);
            view.setSize(ob.object.width, ob.object.height);
            const newPos = [view.x - view.width / 2, view.y - view.height / 2];
            view.setPosition(
              newPos[0] + view.width * ob.object.pivotOrigin.x,
              newPos[1] + view.height * ob.object.pivotOrigin.y
            );
            this.presenterProvider.forEnvironmentObject(
              ob.object,
              view
            );
          }
        })
        .catch(console.log);
    });
  }
}
