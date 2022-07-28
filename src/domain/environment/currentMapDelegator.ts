import { GameObjects } from "phaser";
import { MapUpdateEvent } from "../../infrastructure/events/gameEvents";
import { ClientProvider } from "../../infrastructure/providers/clientProvider";
import { ClientEnvironmentObjectFactory } from "../../view/environmentObjects/clientEnvironmentObjectFactory";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { SceneNames } from "../../view/scenes/SceneNames";
import { createMapOnScene } from "../actions/createMapOnScene";
import { loadMapAssets } from "../actions/loadMapAssets";
import { CollisionManager } from "../collisions/collisionManager";
import { Delegator } from "../delegator";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";
import { ServerConnection } from "../serverConnection";
import { MapManager } from "./mapManager";
import { ProcessedMap } from "./processedMap";

interface LoadedMap {
  map: ProcessedMap;
  createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[];
}

type MapId = number;

export class CurrentMapDelegator implements Delegator {
  private currentMapId: number = -1
  private loadedMaps: { [key: MapId]: LoadedMap } = {};
  public constructor(
    private scene: ClientGameScene,
    private connection: ServerConnection,
    private envObjectsRepository: EnvironmentObjectRepository,
    private mapManager: MapManager,
    private collisionManager: CollisionManager
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      if (this.currentMapId === ev.newMap.id) return
      this.currentMapId = ev.newMap.id
      this.mapManager.setMaps([ev.newMap, ...ev.neighborMaps]);
      return new Promise(async () => {
        await this.loadAssets([ev.newMap]);
        await this.loadAssets(ev.neighborMaps);
        this.createMap([ev.newMap]);
        this.createMap(ev.neighborMaps);

        this.setCameraBounds(ev);
        this.removeUnusedMaps(ev.newMap);
      });
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  private setCameraBounds(ev: MapUpdateEvent) {
    const x =
      ev.newMap.leftMapId === undefined
        ? ev.newMap.originX
        : ev.neighborMaps.find((m) => m.id === ev.newMap.leftMapId)!.originX ??
          0;
    const y =
      ev.newMap.topMapId === undefined
        ? ev.newMap.originY
        : ev.neighborMaps.find((m) => m.id === ev.newMap.topMapId)!.originY ??
          0;
    const width =
      ev.newMap.rightMapId === undefined
        ? ev.newMap.width * 2
        : ev.neighborMaps.find((m) => m.id === ev.newMap.rightMapId)!.originX +
          ev.newMap.width * 3;
    const height =
      ev.newMap.bottomMapId === undefined
        ? ev.newMap.height
        : ev.neighborMaps.find((m) => m.id === ev.newMap.bottomMapId)!.originY +
          y +
          ev.newMap.height;
    this.scene.cameras.main.setBounds(x, y, width, height);
    this.scene.scene
      .get(SceneNames.BackgroundScene)
      .cameras.main.setBounds(x, y, width, height);
  }

  private removeUnusedMaps(currentMap: ProcessedMap) {
    Object.keys(this.loadedMaps).forEach((m) => {
      if (
        ![
          currentMap.bottomMapId,
          currentMap.topMapId,
          currentMap.rightTopMapId,
          currentMap.rightMapId,
          currentMap.rightBottomMapId,
          currentMap.leftTopMapId,
          currentMap.leftMapId,
          currentMap.leftBottomMapId,
          currentMap.id,
        ].includes(Number(m))
      ) {
        this.loadedMaps[m].createdObjects.forEach((o) => o.destroy());
        delete this.loadedMaps[m];
      }
    });
  }

  private async loadAssets(maps: ProcessedMap[]) {
    const loadedKeys = Object.keys(this.loadedMaps);
    return Promise.all(
      maps
        .filter((m) => !loadedKeys.includes(m.id.toString()))
        .map(async (m) => await loadMapAssets(m, this.scene))
    );
  }

  private createMap(maps: ProcessedMap[]) {
    try {
      const loadedKeys = Object.keys(this.loadedMaps);
      return Promise.all(
        maps
          .filter((m) => !loadedKeys.includes(m.id.toString()))
          .map((m) => {
            return createMapOnScene(
              m,
              this.scene,
              this.envObjectsRepository,
              new ClientEnvironmentObjectFactory(
                this.scene,
                ClientProvider.presenterProvider
              ),
              this.collisionManager
            ).then(({ createdObjects, spawnPositions, entrances, exits }) => {
              this.loadedMaps[m.id] = { map: m, createdObjects };
              this.mapManager.hydratateMap(m.id, {
                spawnPositions,
                entrances,
                exits,
              });
              return createdObjects;
            });
          })
      );
    } catch (error) {}
  }
}
