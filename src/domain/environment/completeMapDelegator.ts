import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { MapConfiguration, MapLayer } from "./mapConfiguration";
import { ProcessedMap } from "./processedMap";

export class CompleteMapDelegator implements Delegator {
  private readonly maxWorldWidht = 10000;
  private readonly maxWorldHeight = Infinity;

  private processedMaps: { [key: number]: ProcessedMap } = {};
  private processedMapsAsList: ProcessedMap[] = [];
  private currentX = 0;
  private currentY = 0;
  public constructor(
    private mapConfig: MapConfiguration,
    playerStateRepository: PlayerStateRepository,
    connections: ConnectionsRepository,
    playerConnections: PlayerConnectionsRepository
  ) {
    mapConfig.mapLayers.forEach((layer) => {
      this.processLayer(layer);
    });
    playerStateRepository.onPlayerStateChange.subscribe(
      ({ playerId, state }) => {
        const currentMap = this.processedMaps[state.map.mapId];
        if (!this.isInside(state.position.x, state.position.y, currentMap)) {
          const foundedMap = this.processedMapsAsList.find((map) =>
            this.isInside(state.position.x, state.position.y, map)
          );
          if (!foundedMap) {
            return;
          }
          playerStateRepository.setPlayerState(playerId, {
            ...state,
            map: { mapId: foundedMap.id },
          });
          const connectionId = playerConnections.getConnection(playerId);
          if (connectionId) {
            const connection = connections.getConnection(connectionId);
            if (connection) {
              const neighborMaps = [
                foundedMap.bottomMapId,
                foundedMap.topMapId,
                foundedMap.leftBottomMapId,
                foundedMap.leftMapId,
                foundedMap.leftTopMapId,
                foundedMap.rightBottomMapId,
                foundedMap.rightMapId,
                foundedMap.rightTopMapId,
              ]
                .filter((id) => id !== undefined)
                .map((id) => this.processedMaps[id as number]);
              connection.sendMapUpdateEvent(foundedMap, neighborMaps);
            }
          }
        }
      }
    );
  }

  isInside(x: number, y: number, map: ProcessedMap) {
    return (
      x > map.originX &&
      y > map.originY &&
      x < map.originX + map.width &&
      y < map.originY + map.height
    );
  }

  processLayer(layer: MapLayer) {
    layer.mapsInOrder.forEach((horizontalMaps, i) => {
      horizontalMaps.forEach((map, j) => {
        this.processedMaps[map] = {
          layerId: layer.id,
          id: map,
          originX: this.currentX,
          originY: this.currentY,
          height:
            this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels,
          width:
            this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels,
          leftMapId: (layer.mapsInOrder[i] ?? {})[j - 1],
          rightMapId: (layer.mapsInOrder[i] ?? {})[j + 1],
          topMapId: (layer.mapsInOrder[i - 1] ?? {})[j],
          bottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j],
          leftTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j - 1],
          rightTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j + 1],
          leftBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j - 1],
          rightBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j + 1],
        };

        const nextX =
          this.currentX +
          this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels;
        this.currentX = nextX > this.maxWorldWidht ? 0 : nextX;
        if (nextX > this.maxWorldWidht) {
          const nextY =
            this.currentY +
            this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels;
          this.currentY = nextY > this.maxWorldHeight ? 0 : nextY;
        }
      });
    });
    this.processedMapsAsList = Object.values(this.processedMaps);
  }

  init(): void {
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
