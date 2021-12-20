import { MapConfiguration } from "../../domain/environment/mapConfiguration";
export const MapsConfiguration: MapConfiguration = {
  singleMapSize: { x: 64, y: 64 },
  patronSizeInPixels: 32,
  mapLayers: [
    {
      id: 0,
      mapsInOrder: [
        [
          {
            id: 0,
            backgroundFile: { key: "bg-0", fileName: "bg-0.png" },
            jsonFile: { key: "map-0", fileName: "map-0.json" },
            tilesSourceFiles: { key: "tiles-0", fileName: "tiles-0.png" },
            objectsSourceFile: { key: "obj-0", fileName: "obj-0.png" },
            collidersSourceFile: { key: "col-0", fileName: "col0.png" },
          },
        ],
      ],
    },
  ],
};
