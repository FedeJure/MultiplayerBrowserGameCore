import { GameObjects, Scene } from "phaser";
import { MapsConfiguration } from "../../infrastructure/configuration/MapsConfiguration";
import { PhaserEntranceView } from "../../view/environment/phaserEntranceView";
import { PhaserExitView } from "../../view/environment/phaserExitView";
import { PlatformDetector } from "../../view/environment/platformDetector";
import { ExistentDepths } from "../../view/existentDepths";
import { PhaserLadderView } from "../../view/ladder/phaserLadderView";
import { jsonToGameObjects } from "../../view/utils";
import { CollisionManager } from "../collisions/collisionManager";
import { Entrance } from "../environment/entrance";
import { Exit } from "../environment/exit";
import { Ladder } from "../environment/ladder";

import { ProcessedMap } from "../environment/processedMap";
import { EnvironmentObjectFactory } from "../environmentObjects/environmentObjectFactory";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";
import { Vector } from "../vector";

type MapCreationResponse = {
  createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[];
  spawnPositions: Vector[];
  entrances: Entrance[];
  exits: Exit[];
};

export function createMapOnScene(
  map: ProcessedMap,
  scene: Scene,
  envObjectsRepository: EnvironmentObjectRepository,
  objectsFactory: EnvironmentObjectFactory,
  collisionManager: CollisionManager
) {
  return new Promise<MapCreationResponse>(async (res, _) => {
    const createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[] =
      [];

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

    createBounds(map, scene, collisionManager);

    const colLayer = tilemap.getObjectLayer(
      MapsConfiguration.layerNames.colliders
    );
    const objectLayers = tilemap.getObjectLayer(
      MapsConfiguration.layerNames.objects
    );
    if (objectLayers) {
      objectLayers.objects.forEach(async (o) => {
        if (o.properties?.find((p) => p.name === "type")?.value === "ladder") {
          createLadder(scene, map, o, collisionManager);
          return;
        }
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
      createColliders(colLayer, map, scene, createdObjects, collisionManager),
    ]);
    createMapObjects(scene, map);
    res({
      createdObjects,
      spawnPositions: getSpawnPositions(tilemap),
      exits: getExits(tilemap, collisionManager, map),
      entrances: getEntrances(tilemap, collisionManager, map),
    });
  });
}

function createMapObjects(scene: Scene, map: ProcessedMap) {
  jsonToGameObjects(scene, scene.cache.json.get(map.config.jsonFile.key));
}

function getEntrances(
  tilemap: Phaser.Tilemaps.Tilemap,
  collisionManager: CollisionManager,
  map: ProcessedMap
): Entrance[] {
  const layer = tilemap.getObjectLayer(MapsConfiguration.layerNames.entrances);
  if (!layer) return [];
  const entrances: Entrance[] = [];
  layer.objects.forEach((o) => {
    const { height, width, rectangle, x, y } = o;
    if (!rectangle || x === undefined || y === undefined || !height || !width)
      return;
    const id = o.properties.find((p) => p.name === "id");
    if (id === undefined) return;
    const entrance = {
      id: id.value,
      position: { x: x + map.originX, y: y + map.originY },
      height,
      width,
    };
    new PhaserEntranceView(tilemap.scene, entrance, collisionManager);
    entrances.push(entrance);
  });
  return entrances;
}

function getExits(
  tilemap: Phaser.Tilemaps.Tilemap,
  collisionManager: CollisionManager,
  map: ProcessedMap
): Exit[] {
  const layer = tilemap.getObjectLayer(MapsConfiguration.layerNames.exits);

  if (!layer) return [];

  const exits: Exit[] = [];
  layer.objects.forEach((o) => {
    const { height, width, rectangle, x, y } = o;

    if (!rectangle || x === undefined || y === undefined || !height || !width)
      return;
    const id = o.properties.find((p) => p.name === "id");
    const actionRequired = o.properties.find(
      (p) => p.name === "action_required"
    );
    const destinationMapId = o.properties.find(
      (p) => p.name === "destination_map_id"
    );
    const destinationEntranceId = o.properties.find(
      (p) => p.name === "destination_entrance_id"
    );
    if (
      id === undefined ||
      actionRequired === undefined ||
      destinationEntranceId === undefined ||
      destinationEntranceId === undefined
    )
      return;

    const exit = {
      id: id.value,
      actionRequired: actionRequired.value,
      destinationEntranceId: destinationEntranceId.value,
      destinationMapId: destinationMapId.value,
      position: { x: x + map.originX, y: y + map.originY },
      height,
      width,
    };
    new PhaserExitView(tilemap.scene, exit, collisionManager);
    exits.push(exit);
  });
  return exits;
}

function getSpawnPositions(tilemap: Phaser.Tilemaps.Tilemap): Vector[] {
  const layer = tilemap.getObjectLayer(
    MapsConfiguration.layerNames.spawnPositions
  );

  return layer ? layer.objects.map((o) => ({ x: o.x!, y: o.y! })) : [];
}

async function createLadder(
  scene: Scene,
  map: ProcessedMap,
  object: Phaser.Types.Tilemaps.TiledObject,
  collisionManager: CollisionManager
) {
  const ladder: Ladder = {
    position: {
      x: (object.x || 0) + map.originX,
      y: (object.y || 0) + map.originY,
    },
    height: object.height ?? 0,
    width: object.width ?? 0,
  };
  new PhaserLadderView(scene, ladder, collisionManager);
}

async function createColliders(
  colLayer: Phaser.Tilemaps.ObjectLayer,
  map: ProcessedMap,
  scene: Scene,
  createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[],
  collisionManager: CollisionManager
) {
  return new Promise((res) => {
    colLayer.objects.forEach((obj) => {
      var sp: Phaser.GameObjects.Rectangle | undefined;
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
        rec.setOrigin(0, 0);

        new PlatformDetector(scene, pos.x + 20, pos.y);
        new PlatformDetector(scene, pos.x + (obj.width ?? 0) - 20, pos.y);
        sp = scene.physics.add.existing(rec, true);
        const up = obj.properties?.find((o) => o.name === "up") ?? undefined;
        const down =
          obj.properties?.find((o) => o.name === "down") ?? undefined;
        const left =
          obj.properties?.find((o) => o.name === "left") ?? undefined;
        const right =
          obj.properties?.find((o) => o.name === "right") ?? undefined;
        if (
          up !== undefined ||
          down !== undefined ||
          left !== undefined ||
          right !== undefined
        ) {
          (sp.body as Phaser.Physics.Arcade.Body).checkCollision.up =
            up ?? false;
          (sp.body as Phaser.Physics.Arcade.Body).checkCollision.down =
            down ?? false;
          (sp.body as Phaser.Physics.Arcade.Body).checkCollision.left =
            left ?? false;
          (sp.body as Phaser.Physics.Arcade.Body).checkCollision.right =
            right ?? false;
        }

        sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.angle += obj.rotation || 0;
        sp.setOrigin(0, 0);
        collisionManager.addStaticGround(rec);
        createdObjects.push(rec);
      }

      if (sp !== undefined) {
        createdObjects.push(sp);
      }
      res(createdObjects);
    });
  });
}

function createBounds(
  map: ProcessedMap,
  scene: Scene,
  collisionManager: CollisionManager
) {
  const boundSize = 32;
  if (map.leftMapId === undefined) {
    addBound(
      map.originX,
      map.originY + map.height / 2,
      boundSize,
      map.height + boundSize,
      scene,
      collisionManager
    );
  }
  if (map.rightMapId === undefined) {
    addBound(
      map.originX + map.width,
      map.originY + map.height / 2,
      boundSize,
      map.height + boundSize,
      scene,
      collisionManager
    );
  }
  if (map.topMapId === undefined) {
    addBound(
      map.originX,
      map.originY,
      map.width + boundSize,
      boundSize,
      scene,
      collisionManager
    );
  }
  if (map.bottomMapId === undefined) {
    addBound(
      map.originX,
      map.originY + map.height,
      map.width + boundSize,
      boundSize,
      scene,
      collisionManager
    );
  }
}

function addBound(
  x: number,
  y: number,
  width: number,
  height: number,
  scene: Scene,
  collisionManager: CollisionManager
) {
  collisionManager.addStaticGround(
    scene.physics.add.existing(scene.add.rectangle(x, y, width, height), true)
  );
}
