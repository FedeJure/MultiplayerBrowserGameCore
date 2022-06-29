import { Scene } from "phaser";
import { PhaserLadderView } from "../../view/ladder/phaserLadderView";
import { CollisionManager } from "../collisions/collisionManager";
import { Ladder } from "../environment/ladder";
import { ProcessedMap } from "../environment/processedMap";

export function createLaddersOnScene(
  map: ProcessedMap,
  scene: Scene,
  collisionManager: CollisionManager
) {
  const jsonObject = scene.cache.json.get(
    map.config.mapObjects.key
  ) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number } } & { depth: number })[];

  jsonObject.forEach((object) => {
    if (
      object.name === "ladder" &&
      object.type &&
      object.type === "Rectangle"
    ) {
      const ladder: Ladder = {
        position: {
          x: object.x + map.originX,
          y: object.y + map.originY,
        },
        height: 128 * object.scale.y,
        width: 128 * object.scale.x,
      };
      new PhaserLadderView(scene, ladder, collisionManager).setOrigin(
        object.origin.x,
        object.origin.y
      );
    }
  });
}
