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
            backgroundFile: [
              { key: "bg-00", fileName: "bg-00.png" },
              { key: "bg-01", fileName: "bg-01.png" },
              { key: "bg-02", fileName: "bg-00.png" },
              { key: "bg-02", fileName: "bg-02.png" },
              { key: "bg-03", fileName: "bg-03.png" },
              { key: "bg-04", fileName: "bg-04.png" },
              { key: "bg-05", fileName: "bg-05.png" },
              { key: "bg-06", fileName: "bg-06.png" },
            ],
            jsonFile: { key: "map-0", fileName: "map-0.json" },
            tilesSourceFiles: { key: "tiles-0", fileName: "tiles-0.png" },
            objectsSourceFile: { key: "obj-0", fileName: "obj-0.png" },
            collidersSourceFile: { key: "col-0", fileName: "" },
          },
          {
            id: 1,
            backgroundFile: [{ key: "bg-1", fileName: "bg-1.png" }],
            jsonFile: { key: "map-1", fileName: "map-1.json" },
            tilesSourceFiles: { key: "tiles-1", fileName: "tiles-1.png" },
            objectsSourceFile: { key: "obj-1", fileName: "obj-1.png" },
            collidersSourceFile: { key: "col-1", fileName: "" },
          },
          {
            id: 2,
            backgroundFile: [{ key: "bg-2", fileName: "bg-2.png" }],
            jsonFile: { key: "map-2", fileName: "map-2.json" },
            tilesSourceFiles: { key: "tiles-2", fileName: "tiles-2.png" },
            objectsSourceFile: { key: "obj-2", fileName: "obj-2.png" },
            collidersSourceFile: { key: "col-2", fileName: "" },
          },
        ],
      ],
    },
  ],
};
