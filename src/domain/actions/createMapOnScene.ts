import { GameObjects, Scene } from "phaser";
import { MapsConfiguration } from "../../infrastructure/configuration/MapsConfiguration";
import { PhaserEntranceView } from "../../view/environment/phaserEntranceView";
import { PhaserExitView } from "../../view/environment/phaserExitView";
import { ExistentDepths } from "../../view/existentDepths";
import { CollisionManager } from "../collisions/collisionManager";
import { Entrance } from "../environment/entrance";
import { Exit } from "../environment/exit";

import { ProcessedMap } from "../environment/processedMap";
import { EnvironmentObjectFactory } from "../environmentObjects/environmentObjectFactory";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";
import { Vector } from "../vector";
import { createLaddersOnScene } from "./createLaddersOnScene";
import { createMapCollidersOnScene } from "./createMapCollidersOnScene";

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

    createMapCollidersOnScene(map, scene, collisionManager);
    createLaddersOnScene(map, scene, collisionManager);
    createMapObjects(scene, map);
    res({
      createdObjects,
      spawnPositions: getSpawnPositions(tilemap),
      exits: getExits(scene, map, collisionManager),
      entrances: getEntrances(scene, map, collisionManager),
    });
  });
}

function createMapObjects(scene: Scene, map: ProcessedMap) {
  const json = scene.cache.json.get(
    map.config.jsonFile.key
  ) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number } } & { depth: number })[];
  json.forEach((object) => {
    if (object.type && object.type === "Image") {
      scene.add
        .image(
          object.x + map.originX,
          object.y + map.originY,
          object.textureKey,
          object.frameKey
        )
        .setOrigin(object.origin.x, object.origin.y)
        .setScale(object.scale.x, object.scale.y)
        .setRotation(object.rotation)
        .setFlip(object.flipX, object.flipY)
        .setDepth(object.depth);
    }
  });
}

function getEntrances(
  scene: Scene,
  map: ProcessedMap,
  collisionManager: CollisionManager
) {
  const json = scene.cache.json.get(
    map.config.jsonFile.key
  ) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number } } & { depth: number })[];
  const entrances: Entrance[] = [];
  json.forEach((object) => {
    if (
      object.name === "entrance" &&
      object.type &&
      object.type === "Rectangle"
    ) {
      const data = object.data as {
        id?: string;
      };
      if (!data.id) return;
      const entrance = {
        id: data.id,
        position: { x: object.x + map.originX, y: object.y + map.originY },
        height: 128 * object.scale.y,
        width: 128 * object.scale.x,
      };

      new PhaserEntranceView(
        scene,
        entrance,
        collisionManager,
        object.origin.x,
        object.origin.y
      );
      entrances.push(entrance);
    }
  });
  return entrances;
}

function getExits(
  scene: Scene,
  map: ProcessedMap,
  collisionManager: CollisionManager
) {
  const json = scene.cache.json.get(
    map.config.jsonFile.key
  ) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number } } & { depth: number })[];
  const exits: Exit[] = [];
  json.forEach((object) => {
    if (
      object.name === "entrance" &&
      object.type &&
      object.type === "Rectangle"
    ) {
      const data = object.data as {
        id?: string;
        action_required?: boolean;
        destination_map_id?: number;
        destination_entrance_id?: string;
      };
      if (
        !data.id ||
        data.action_required === undefined ||
        !data.destination_map_id ||
        !data.destination_entrance_id
      )
        return;
      const exit: Exit = {
        id: data.id,
        position: { x: object.x + map.originX, y: object.y + map.originY },
        height: 128 * object.scale.y,
        width: 128 * object.scale.x,
        actionRequired: data.action_required,
        destinationMapId: data.destination_map_id,
        destinationEntranceId: data.destination_entrance_id,
      };

      new PhaserExitView(
        scene,
        exit,
        collisionManager,
        object.origin.x,
        object.origin.y
      );
      exits.push(exit);
    }
  });
  return exits;
}

function getSpawnPositions(tilemap: Phaser.Tilemaps.Tilemap): Vector[] {
  const layer = tilemap.getObjectLayer(
    MapsConfiguration.layerNames.spawnPositions
  );

  return layer ? layer.objects.map((o) => ({ x: o.x!, y: o.y! })) : [];
}
