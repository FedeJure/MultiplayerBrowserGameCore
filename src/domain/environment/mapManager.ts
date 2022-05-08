import { ControllablePlayer } from "../player/players/controllablePlayer";
import { MapConfiguration, MapLayer } from "./mapConfiguration";
import { ProcessedMap } from "./processedMap";

export class MapManager {
  private processedMaps: { [key: number]: ProcessedMap } = {};
  private processedMapsAsList: ProcessedMap[] = [];

  private readonly maxWorldWidht = 10000;
  private readonly maxWorldHeight = Infinity;
  private currentX = 0;
  private currentY = 0;

  constructor(private mapConfig: MapConfiguration) {
    mapConfig.mapLayers.forEach((layer) => {
      this.processLayer(layer);
    });
  }

  private isInside(x: number, y: number, map: ProcessedMap) {
    return (
      x > map.originX &&
      y > map.originY &&
      x < map.originX + map.width &&
      y < map.originY + map.height
    );
  }

  public get maps() {
    return this.processedMapsAsList;
  }

  getMapForPlayer(player: ControllablePlayer) {
    const { state } = player;
    const currentMap = this.processedMaps[state.map.mapId];
    if (!this.isInside(state.position.x, state.position.y, currentMap)) {
      const foundedMap = this.processedMapsAsList.find((map) =>
        this.isInside(state.position.x, state.position.y, map)
      );
      return {
        foundedMap,
        neighborMaps: [
          foundedMap?.bottomMapId,
          foundedMap?.topMapId,
          foundedMap?.leftBottomMapId,
          foundedMap?.leftMapId,
          foundedMap?.leftTopMapId,
          foundedMap?.rightBottomMapId,
          foundedMap?.rightMapId,
          foundedMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
    } else
      return {
        foundedMap: currentMap,
        neighborMaps: [
          currentMap?.bottomMapId,
          currentMap?.topMapId,
          currentMap?.leftBottomMapId,
          currentMap?.leftMapId,
          currentMap?.leftTopMapId,
          currentMap?.rightBottomMapId,
          currentMap?.rightMapId,
          currentMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
  }

  processLayer(layer: MapLayer) {
    layer.mapsInOrder.forEach((horizontalMaps, i) => {
      horizontalMaps.forEach((map, j) => {
        this.processedMaps[map.id] = {
          config: map,
          layerId: layer.id,
          id: map.id,
          originX: this.currentX,
          originY: this.currentY,
          height:
            this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels,
          width:
            this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels,
          leftMapId: (layer.mapsInOrder[i] ?? {})[j - 1]?.id,
          rightMapId: (layer.mapsInOrder[i] ?? {})[j + 1]?.id,
          topMapId: (layer.mapsInOrder[i - 1] ?? {})[j]?.id,
          bottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j]?.id,
          leftTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j - 1]?.id,
          rightTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j + 1]?.id,
          leftBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j - 1]?.id,
          rightBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j + 1]?.id,
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
}
