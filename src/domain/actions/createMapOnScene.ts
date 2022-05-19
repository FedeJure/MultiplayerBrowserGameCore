import { GameObjects, Scene } from "phaser";
import { MapsConfiguration } from "../../infrastructure/configuration/MapsConfiguration";
import { ExistentDepths } from "../../view/existentDepths";
import { CollisionCategory } from "../collisions/collisionTypes";

import { ProcessedMap } from "../environment/processedMap";
import { EnvironmentObjectFactory } from "../environmentObjects/environmentobjectFactory";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";

export function createMapOnScene(
  map: ProcessedMap,
  scene: Scene,
  envObjectsRepository: EnvironmentObjectRepository,
  objectsFactory: EnvironmentObjectFactory
) {
  return new Promise<(GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[]>(
    async (res, _) => {
      const createdObjects: (
        | GameObjects.GameObject
        | Phaser.Tilemaps.Tilemap
      )[] = [];

      const tilemap = scene.make.tilemap({
        key: map.config.jsonFile.key,
      });
      createdObjects.push(tilemap);

      map.config.sourceFiles.forEach((sourceFile) => {
        tilemap.addTilesetImage(sourceFile.key, sourceFile.key);
      });
      const tilesets = map.config.sourceFiles.map((s) => s.key);
      tilemap.layers.forEach((l) => {
        tilemap
          .createLayer(l.name, tilesets, map.originX, map.originY)
          .setDepth(ExistentDepths.GROUND_BACKGROUND);
      });

      createBounds(map, scene);

      const colLayer = tilemap.getObjectLayer(
        MapsConfiguration.layerNames.colliders
      );
      const objectLayers = tilemap.getObjectLayer(
        MapsConfiguration.layerNames.objects
      );
      if (objectLayers) {
        objectLayers.objects.forEach(async (o) => {
          const id = o.properties?.find((p) => p.name === "id")?.value as
            | number
            | undefined;

          if (!id) return;
          const object = await envObjectsRepository.get(id);
          objectsFactory.createObjects([
            {
              object,
              position: { x: o.x! + map.originX, y: o.y! + map.originY },
            },
          ]);
        });
      }
      await Promise.all([
        createColliders(colLayer, map, scene, createdObjects),
      ]);

      res(createdObjects);
    }
  );
}

async function createColliders(
  colLayer: Phaser.Tilemaps.ObjectLayer,
  map: ProcessedMap,
  scene: Scene,
  createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[]
) {
  return new Promise((res) => {
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
          label: "Static Environment",
        }) as Phaser.Physics.Matter.Sprite;
        sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.angle += obj.rotation || 0;
        sp.setOrigin(0, 0);
        createdObjects.push(rec);
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
          label: "Static Environment",
        }) as Phaser.Physics.Matter.Sprite;
        sp.setDisplayOrigin(0);
        createdObjects.push(pol);
      }

      if (sp !== undefined) {
        createdObjects.push(sp);
        sp.setBounce(0);
        sp.setFriction(0);
        sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
        sp.setCollidesWith([
          CollisionCategory.Player,
          CollisionCategory.StaticEnvironment,
        ]);
      }
      res(createdObjects);
    });
  });
}

function createBounds(map: ProcessedMap, scene: Scene) {
  const boundSize = 32;
  if (map.leftMapId === undefined) {
    addBound(
      map.originX,
      map.originY + map.height / 2,
      boundSize,
      map.height + boundSize,
      scene
    );
  }
  if (map.rightMapId === undefined) {
    addBound(
      map.originX + map.width,
      map.originY + map.height / 2,
      boundSize,
      map.height + boundSize,
      scene
    );
  }
  if (map.topMapId === undefined) {
    addBound(map.originX, map.originY, map.width + boundSize, boundSize, scene);
  }
  if (map.bottomMapId === undefined) {
    addBound(
      map.originX,
      map.originY + map.height,
      map.width + boundSize,
      boundSize,
      scene
    );
  }
}

function addBound(
  x: number,
  y: number,
  width: number,
  height: number,
  scene: Scene
) {
  scene.matter.add.rectangle(x, y, width, height, {
    isStatic: true,
    label: "Bound Wall",
  }).collisionFilter = {
    group: 0,
    mask: CollisionCategory.Player,
    category: CollisionCategory.WorldBounds,
  };
}
