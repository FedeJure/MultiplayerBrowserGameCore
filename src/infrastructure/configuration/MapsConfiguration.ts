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
            backgroundFile: [
              { key: "bg-10", fileName: "bg-10.png" },
              { key: "bg-11", fileName: "bg-11.png" },
              { key: "bg-12", fileName: "bg-12.png" },
              { key: "bg-13", fileName: "bg-13.png" },
              { key: "bg-14", fileName: "bg-14.png" },
              { key: "bg-15", fileName: "bg-15.png" },
              { key: "bg-16", fileName: "bg-16.png" },
            ],
            jsonFile: { key: "map-1", fileName: "map-1.json" },
            tilesSourceFiles: { key: "tiles-1", fileName: "tiles-1.png" },
            objectsSourceFile: { key: "obj-1", fileName: "obj-1.png" },
            collidersSourceFile: { key: "col-1", fileName: "" },
          },
          {
            id: 2,
            backgroundFile: [
              { key: "bg-20", fileName: "bg-20.png" },
              { key: "bg-21", fileName: "bg-21.png" },
              { key: "bg-22", fileName: "bg-22.png" },
              { key: "bg-23", fileName: "bg-23.png" },
              { key: "bg-24", fileName: "bg-24.png" },
              { key: "bg-25", fileName: "bg-25.png" },
              { key: "bg-26", fileName: "bg-26.png" },
            ],
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
