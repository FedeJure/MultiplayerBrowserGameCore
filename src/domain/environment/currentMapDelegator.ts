import { GameObjects } from "phaser";
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
    private originUrl: string,
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap]);
      await this.createMap([ev.newMap]);
      await this.loadAssets(ev.neighborMaps);
      await this.createMap(ev.neighborMaps);
      this.removeUnusedMaps(ev.newMap);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

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
