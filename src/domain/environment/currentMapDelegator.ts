import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { MapUpdateEvent } from "../../infrastructure/events/gameEvents";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { createMapOnScene } from "../actions/createMapOnScene";
import { loadMapAssets } from "../actions/loadMapAssets";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

interface LoadedMap {
  map: ProcessedMap;
  createdObjects: (GameObjects.GameObject | Phaser.Tilemaps.Tilemap)[];
}

type MapId = number;

export class CurrentMapDelegator implements Delegator {
  private loadedMaps: { [key: MapId]: LoadedMap } = {};
  public constructor(
    private scene: ClientGameScene,
    private connection: ServerConnection,
    private originUrl: string
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
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
    this.scene.cameras.main.setBounds(x, -99999, width, 9999999999);
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
        .map((m) => loadMapAssets(this.originUrl, m, this.scene))
    );
  }

  private createMap(maps: ProcessedMap[]) {
    try {
      const loadedKeys = Object.keys(this.loadedMaps);

      return Promise.all(
        maps
          .filter((m) => !loadedKeys.includes(m.id.toString()))
          .map((m) => {
            return createMapOnScene(m, this.scene).then((createdObjects) => {
              this.loadedMaps[m.id] = { map: m, createdObjects };
              return createdObjects;
            });
          })
      );
    } catch (error) {}
  }
}
