import { MapConfiguration } from "../../domain/environment/mapConfiguration";
export const MapsConfiguration: MapConfiguration = {
  singleMapSize: { x: 64, y: 64 },
  patronSizeInPixels: 32,
  layerNames: {
    //Those are the layers on Tiled
    colliders: "colliders",
    ground: "ground",
    objects: "objects",
    spawnPositions: 'spawn_positions',
    entrances: 'entrances',
    exits: 'exits'
  },
  mapLayers: [
    {
      id: 0,
      mapsInOrder: [
        [
          {
            id: 0,
            backgroundFile: [
              { key: "forest-00", fileName: "mapsBgs/forest-00.png" },
              { key: "forest-01", fileName: "mapsBgs/forest-01.png" },
              { key: "forest-02", fileName: "mapsBgs/forest-02.png" },
              { key: "forest-03", fileName: "mapsBgs/forest-03.png" },
              { key: "forest-04", fileName: "mapsBgs/forest-04.png" },
              { key: "forest-05", fileName: "mapsBgs/forest-05.png" },
              { key: "forest-06", fileName: "mapsBgs/forest-06.png" },
            ],
            jsonFile: {
              key: "forest-0",
              fileName: "mapConfigFiles/forest/forest-0.json",
            },
            sourceFiles: [
              { key: "forest", fileName: "mapTiles/forest.png" },
              { key: "farm", fileName: "mapStaticObjects/farm.png" },
              { key: "plants", fileName: "mapStaticObjects/plants.xml" },
            ],
            objects: [],
          },
          {
            id: 1,
            backgroundFile: [
              { key: "forest-10", fileName: "mapsBgs/forest-00.png" },
              { key: "forest-11", fileName: "mapsBgs/forest-01.png" },
              { key: "forest-12", fileName: "mapsBgs/forest-02.png" },
              { key: "forest-13", fileName: "mapsBgs/forest-03.png" },
              { key: "forest-14", fileName: "mapsBgs/forest-04.png" },
              { key: "forest-15", fileName: "mapsBgs/forest-05.png" },
              { key: "forest-16", fileName: "mapsBgs/forest-06.png" },
            ],
            jsonFile: {
              key: "forest-1",
              fileName: "mapConfigFiles/forest/forest-1.json",
            },
            sourceFiles: [
              { key: "forest", fileName: "mapTiles/forest.png" },
              { key: "farm", fileName: "mapStaticObjects/farm.png" },
            ],
            objects: [],
          },
          // {
          //   id: 2,
          //   backgroundFile: [
          //     { key: "forest-30", fileName: "mapsBgs/forest-00.png" },
          //     { key: "forest-31", fileName: "mapsBgs/forest-01.png" },
          //     { key: "forest-32", fileName: "mapsBgs/forest-02.png" },
          //     { key: "forest-33", fileName: "mapsBgs/forest-03.png" },
          //     { key: "forest-34", fileName: "mapsBgs/forest-04.png" },
          //     { key: "forest-35", fileName: "mapsBgs/forest-05.png" },
          //     { key: "forest-36", fileName: "mapsBgs/forest-06.png" },
          //   ],
          //   jsonFile: {
          //     key: "forest-village-0",
          //     fileName: "mapConfigFiles/forest/forest-village-0.json",
          //   },
          //   sourceFiles: [
          //     { key: "forest", fileName: "mapTiles/forest.png" },
          //     { key: "farm", fileName: "mapStaticObjects/farm.png" },
          //     { key: "buildings1", fileName: "mapTiles/buildings1.png" },
          //   ],
          //   objects: [],
          // },
        ],
      ],
    },
  ],
};
