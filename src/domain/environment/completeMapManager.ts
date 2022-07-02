import { MapConfiguration, MapLayer } from "./mapConfiguration";
import { MapManager } from "./mapManager";
import { ProcessedMap } from "./processedMap";

export class CompleteMapManager extends MapManager {

  private readonly maxWorldWidht = 10000;
  private readonly maxWorldHeight = Infinity;
  private currentX = 0;
  private currentY = 0;

  constructor(private mapConfig: MapConfiguration) {
    super();
    this.setMaps(mapConfig.mapLayers.flatMap(this.processLayer.bind(this)));
  }

  processLayer(layer: MapLayer) {
    const maps: ProcessedMap[] = [];
    layer.mapsInOrder.forEach((horizontalMaps, i) => {
      horizontalMaps.forEach((map, j) => {
        maps.push({
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
          spawnPositions: [],
          entrances: [],
          exits: [],
          enemySpawners: []
        });

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
    return maps
  }
}
