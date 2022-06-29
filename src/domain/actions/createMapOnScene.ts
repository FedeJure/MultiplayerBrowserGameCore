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
      exits: getExits(tilemap, collisionManager, map),
      entrances: getEntrances(tilemap, collisionManager, map),
    });
  });
}

function createMapObjects(scene: Scene, map: ProcessedMap) {
  const json = scene.cache.json.get(map.config.jsonFile.key) as (Phaser.Types.GameObjects.JSONGameObject & {
    scale: { x: number; y: number };
  } & { origin: { x: number; y: number } } & { depth: number })[]
  const group = scene.add.group()
  json.forEach((object) => {
    if (object.type && object.type === "Image") {
      group.add(
        scene.add
          .image(object.x + map.originX, object.y + map.originY, object.textureKey, object.frameKey)
          .setOrigin(object.origin.x, object.origin.y)
          .setScale(object.scale.x, object.scale.y)
          .setRotation(object.rotation)
          .setFlip(object.flipX, object.flipY)
          .setDepth(object.depth)
      );
    }
  });
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
