import { MapConfiguration } from "../../domain/environment/mapConfiguration";

export const MapsConfiguration: MapConfiguration = {
  singleMapSize: { x: 64, y: 64 },
  patronSizeInPixels: 32,
  mapLayers: [{mapsInOrder: [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]]},{mapsInOrder: [[10, 11]]}],
};
