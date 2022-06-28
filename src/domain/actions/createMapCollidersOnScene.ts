import { GameObjects, Scene } from "phaser";
import { PlatformDetector } from "../../view/environment/platformDetector";
import { CollisionManager } from "../collisions/collisionManager";
import { ProcessedMap } from "../environment/processedMap";

export function createMapCollidersOnScene(
  map: ProcessedMap,
  scene: Scene,
  collisionManager: CollisionManager
) {
  const jsonObject = scene.cache.json.get(
    map.config.mapObjects.key
  ) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number }} & { depth: number })[];
  const createdObjects: GameObjects.Rectangle[] = [];
  jsonObject.forEach((object) => {
    if (object.type && object.type === "Rectangle") {
      const pos = {
        x: object.x + map.originX,
        y: object.y + map.originY,
      };
      const data = object.data as {
        up?: boolean;
        down?: boolean;
        left?: boolean;
        right?: boolean;
      };
      const rectangle = scene.add
        .rectangle(pos.x, pos.y, 128 * object.scale.x, 128 * object.scale.y)
        .setRotation(object.rotation)
        .setOrigin(object.origin.x, object.origin.y)
        .setDepth(object.depth);

      createdObjects.push(rectangle);
      scene.physics.add.existing(rectangle, true);

      new PlatformDetector(scene, pos.x + 20, pos.y);
      new PlatformDetector(scene, pos.x + (rectangle.width ?? 0) - 20, pos.y);

      if (data.up || data.down || data.left || data.right) {
        const body = rectangle.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.down = data.down ?? false;
        body.checkCollision.up = data.up ?? false;
        body.checkCollision.left = data.left ?? false;
        body.checkCollision.right = data.right ?? false;
      }
      collisionManager.addStaticGround(rectangle);
    }
  });
}
