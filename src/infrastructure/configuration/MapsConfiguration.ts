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
            backgroundFile: { key: "bg-0", fileName: "background0.png" },
            jsonFile: { key: "map-0", fileName: "map-0.json" },
            tilesSourceFiles: [{ key: "tiles-0", fileName: "tiles-0.png" }],
            objectsSourceFile: { key: "obj-0", fileName: "obj-0.png" },
            collidersSourceFile: { key: "col-0", fileName: "col0.png" },
          },
          {
            id: 1,
            backgroundFile: { key: "", fileName: "" },
            jsonFile: { key: "", fileName: "" },
            tilesSourceFiles: [{ key: "", fileName: "" }],
            objectsSourceFile: { key: "", fileName: "" },
            collidersSourceFile: { key: "", fileName: "" },
          },
        ],
        [
          {
            id: 2,
            backgroundFile: { key: "", fileName: "" },
            jsonFile: { key: "", fileName: "" },
            tilesSourceFiles: [{ key: "", fileName: "" }],
            objectsSourceFile: { key: "", fileName: "" },
            collidersSourceFile: { key: "", fileName: "" },
          },
          {
            id: 3,
            backgroundFile: { key: "", fileName: "" },
            jsonFile: { key: "", fileName: "" },
            tilesSourceFiles: [{ key: "", fileName: "" }],
            objectsSourceFile: { key: "", fileName: "" },
            collidersSourceFile: { key: "", fileName: "" },
          },
        ],
      ],
    },
    {
      id: 1,
      mapsInOrder: [
        [
          {
            id: 4,
            backgroundFile: { key: "", fileName: "" },
            jsonFile: { key: "", fileName: "" },
            tilesSourceFiles: [{ key: "", fileName: "" }],
            objectsSourceFile: { key: "", fileName: "" },
            collidersSourceFile: { key: "", fileName: "" },
          },
          {
            id: 5,
            backgroundFile: { key: "", fileName: "" },
            jsonFile: { key: "", fileName: "" },
            tilesSourceFiles: [{ key: "", fileName: "" }],
            objectsSourceFile: { key: "", fileName: "" },
            collidersSourceFile: { key: "", fileName: "" },
          },
        ],
      ],
    },
  ],
};
