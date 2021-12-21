import { Scene } from "phaser";
import { CollisionCategory } from "../collisions/collisionTypes";
import { ProcessedMap } from "../environment/processedMap";

export async function createMapOnScene(map: ProcessedMap, scene: Scene) {
  return new Promise<void>((res, _) => {
    const tilemap = scene.make.tilemap({
      key: map.config.jsonFile.key,
    });
    tilemap.addTilesetImage(
      map.config.tilesSourceFiles.key,
      map.config.tilesSourceFiles.key
    );
    tilemap.addTilesetImage(
      map.config.objectsSourceFile.key,
      map.config.objectsSourceFile.key
    );
    tilemap.createLayer(
      "ground",
      map.config.tilesSourceFiles.key,
      map.originX,
      map.originY
    );
    tilemap.createLayer(
      "objects",
      map.config.objectsSourceFile.key,
      map.originX,
      map.originY
    );

    const colLayer = tilemap.getObjectLayer("colliders");
    colLayer.objects.forEach((obj) => {
      var sp: Phaser.Physics.Matter.Sprite | undefined;
      const pos = {
        x: (obj.x || 0) + map.originX,
        y: (obj.y || 0) + map.originY,
      };
      if (obj.rectangle) {
        const rec = new Phaser.GameObjects.Rectangle(
          scene,
          pos.x,
          pos.y,
          obj.width,
          obj.height
        );

        sp = scene.matter.add.gameObject(rec, {
          isStatic: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.angle += obj.rotation || 0;
        sp.setOrigin(0, 0);
      }

      if (obj.polygon) {
        const pol = new Phaser.GameObjects.Polygon(
          scene,
          pos.x,
          pos.y,
          obj.polygon
        );
        pol.setPosition(pol.x + pol.displayOriginX, pol.y - pol.displayOriginY);
        sp = scene.matter.add.gameObject(pol, {
          vertices: obj.polygon,
          isStatic: true,
          friction: 0,
          angle: pol.rotation,
          restitution: 0,
          frictionAir: 0,
          ignoreGravity: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setDisplayOrigin(0);
      }

      if (sp !== undefined) {
        sp.setBounce(0);
        sp.setFriction(0);
        sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
        sp.setCollidesWith([
          CollisionCategory.Player,
          CollisionCategory.StaticEnvironment,
        ]);
      }
    });
  });
}
