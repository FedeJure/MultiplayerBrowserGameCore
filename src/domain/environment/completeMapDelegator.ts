import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { MapConfiguration, MapLayer } from "./mapConfiguration";
import { ProcessedMap } from "./processedMap";

export class CurrentMapDelegator implements Delegator {
  private readonly maxWorldWidht = 10000;
  private readonly maxWorldHeight = Infinity;

  private processedMaps: { [key: number]: ProcessedMap } = {};
  private currentX = 0;
  private currentY = 0;
  public constructor(private mapConfig: MapConfiguration) {
    mapConfig.mapLayers.forEach((layer) => {
      this.processLayer(layer);
    });
  }
  processLayer(layer: MapLayer) {
      layer.mapsInOrder.forEach((horizontalMaps, i) => {
        horizontalMaps.forEach((map, j) => {
            this.processedMaps[map] = {
                layerId: layer.id,
                id: map,
                originX: this.currentX,
                originY: this.currentY,
                height: this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels,
                width: this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels,
                leftMapId: layer.mapsInOrder[i][j -1],
                rightMapId: layer.mapsInOrder[i][j+1],
                topMapId: layer.mapsInOrder[i-1][j],
                bottomMapId: layer.mapsInOrder[i+1][j],
                leftTopMapId: layer.mapsInOrder[i-1][j-1],
                rightTopMapId: layer.mapsInOrder[i-1][j+1],
                leftBottomMapId: layer.mapsInOrder[i+1][j-1],
                rightBottomMapId: layer.mapsInOrder[i+1][j+1]
            }

            const nextX = this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels + 1
            const nextY = this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels
            this.currentX = nextX > this.maxWorldWidht ? 0 : nextX
            this.currentY = nextY > this.maxWorldHeight ? 0 : nextY
        })
      })
  }

  init(): void {}
  stop(): void {
    throw new Error("Method not implemented.");
  }
  update(time: number, delta: number): void {
    throw new Error("Method not implemented.");
  }
}
