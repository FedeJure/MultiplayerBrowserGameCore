import { MapConfiguration } from "../../domain/environment/mapConfiguration";
export const MapsConfiguration: MapConfiguration = {
  singleMapSize: { x: 64, y: 64 },
  patronSizeInPixels: 32,
  layerNames: {
    //Those are the layers on Tiled
    colliders: "colliders",
    ground: "ground",
    objects: "objects",
    spawnPositions: "spawn_positions",
    entrances: "entrances",
    exits: "exits",
  },
  mapLayers: [
    {
      id: 0,
      mapsInOrder: [
        [
          {
            id: 0,
            backgroundFile: [
              {
                key: "forest-00",
                fileName: "backgrounds/forest/forest-00.png",
              },
              {
                key: "forest-01",
                fileName: "backgrounds/forest/forest-01.png",
              },
              {
                key: "forest-02",
                fileName: "backgrounds/forest/forest-02.png",
              },
              {
                key: "forest-03",
                fileName: "backgrounds/forest/forest-03.png",
              },
              {
                key: "forest-04",
                fileName: "backgrounds/forest/forest-04.png",
              },
              {
                key: "forest-05",
                fileName: "backgrounds/forest/forest-05.png",
              },
              {
                key: "forest-06",
                fileName: "backgrounds/forest/forest-06.png",
              },
            ],
            jsonFile: {
              key: "forest-0",
              fileName: "mapConfigs/forest/forest_0.json",
            },
            sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
            objects: [],
            mapAtlases: [
              {
                key: "texture",
                jsonFileName: "atlas/forest/texture.json",
                textureFileName: "atlas/forest/texture.png",
              },
            ],
            mapObjects: {
              key: "forest-0",
              fileName: "mapConfigs/forest/forest_0_objects.json",
            },
          },
          {
            id: 1,
            backgroundFile: [
              {
                key: "forest-10",
                fileName: "backgrounds/forest/forest-00.png",
              },
              {
                key: "forest-11",
                fileName: "backgrounds/forest/forest-01.png",
              },
              {
                key: "forest-12",
                fileName: "backgrounds/forest/forest-02.png",
              },
              {
                key: "forest-13",
                fileName: "backgrounds/forest/forest-03.png",
              },
              {
                key: "forest-14",
                fileName: "backgrounds/forest/forest-04.png",
              },
              {
                key: "forest-15",
                fileName: "backgrounds/forest/forest-05.png",
              },
              {
                key: "forest-16",
                fileName: "backgrounds/forest/forest-06.png",
              },
            ],
            jsonFile: {
              key: "forest-village",
              fileName: "mapConfigs/forest/forest_2_village.json",
            },
            sourceFiles: [
              { key: "forest", fileName: "tiles/forest.png" },
              { key: "farm", fileName: "tiles/farm.png" },
            ],
            objects: [],
            mapAtlases: [
              {
                key: "village",
                jsonFileName: "atlas/forest/village.json",
                textureFileName: "atlas/forest/village.png",
              },
            ],
            mapObjects: {
              key: "forest-village",
              fileName: "mapConfigs/forest/forest_2_village_config.json",
            },
          },
          {
            id: 2,
            backgroundFile: [
              {
                key: "forest-20",
                fileName: "backgrounds/forest/forest-00.png",
              },
              {
                key: "forest-21",
                fileName: "backgrounds/forest/forest-01.png",
              },
              {
                key: "forest-22",
                fileName: "backgrounds/forest/forest-02.png",
              },
              {
                key: "forest-23",
                fileName: "backgrounds/forest/forest-03.png",
              },
              {
                key: "forest-24",
                fileName: "backgrounds/forest/forest-04.png",
              },
              {
                key: "forest-25",
                fileName: "backgrounds/forest/forest-05.png",
              },
              {
                key: "forest-26",
                fileName: "backgrounds/forest/forest-06.png",
              },
            ],
            jsonFile: {
              key: "forest-2",
              fileName: "mapConfigs/forest/forest_0.json",
            },
            sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
            objects: [],
            mapAtlases: [
              {
                key: "texture",
                jsonFileName: "atlas/forest/texture.json",
                textureFileName: "atlas/forest/texture.png",
              },
            ],
            mapObjects: {
              key: "forest-2",
              fileName: "mapConfigs/forest/forest_0_objects.json",
            },
          },
          // {
          //   id: 3,
          //   backgroundFile: [
          //     {
          //       key: "forest-30",
          //       fileName: "backgrounds/forest/forest-00.png",
          //     },
          //     {
          //       key: "forest-31",
          //       fileName: "backgrounds/forest/forest-01.png",
          //     },
          //     {
          //       key: "forest-32",
          //       fileName: "backgrounds/forest/forest-02.png",
          //     },
          //     {
          //       key: "forest-33",
          //       fileName: "backgrounds/forest/forest-03.png",
          //     },
          //     {
          //       key: "forest-34",
          //       fileName: "backgrounds/forest/forest-04.png",
          //     },
          //     {
          //       key: "forest-35",
          //       fileName: "backgrounds/forest/forest-05.png",
          //     },
          //     {
          //       key: "forest-36",
          //       fileName: "backgrounds/forest/forest-06.png",
          //     },
          //   ],
          //   jsonFile: {
          //     key: "forest-3",
          //     fileName: "mapConfigs/forest/forest_0.json",
          //   },
          //   sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
          //   objects: [],
          //   mapAtlases: [
          //     {
          //       key: "texture",
          //       jsonFileName: "atlas/forest/texture.json",
          //       textureFileName: "atlas/forest/texture.png",
          //     },
          //   ],
          //   mapObjects: {
          //     key: "forest-3",
          //     fileName: "mapConfigs/forest/forest_0_objects.json",
          //   },
          // },
          // {
          //   id: 4,
          //   backgroundFile: [
          //     {
          //       key: "forest-40",
          //       fileName: "backgrounds/forest/forest-00.png",
          //     },
          //     {
          //       key: "forest-41",
          //       fileName: "backgrounds/forest/forest-01.png",
          //     },
          //     {
          //       key: "forest-42",
          //       fileName: "backgrounds/forest/forest-02.png",
          //     },
          //     {
          //       key: "forest-43",
          //       fileName: "backgrounds/forest/forest-03.png",
          //     },
          //     {
          //       key: "forest-44",
          //       fileName: "backgrounds/forest/forest-04.png",
          //     },
          //     {
          //       key: "forest-45",
          //       fileName: "backgrounds/forest/forest-05.png",
          //     },
          //     {
          //       key: "forest-46",
          //       fileName: "backgrounds/forest/forest-06.png",
          //     },
          //   ],
          //   jsonFile: {
          //     key: "forest-4",
          //     fileName: "mapConfigs/forest/forest_0.json",
          //   },
          //   sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
          //   objects: [],
          //   mapAtlases: [
          //     {
          //       key: "texture",
          //       jsonFileName: "atlas/forest/texture.json",
          //       textureFileName: "atlas/forest/texture.png",
          //     },
          //   ],
          //   mapObjects: {
          //     key: "forest-4",
          //     fileName: "mapConfigs/forest/forest_0_objects.json",
          //   },
          // },
          // {
          //   id: 5,
          //   backgroundFile: [
          //     {
          //       key: "forest-40",
          //       fileName: "backgrounds/forest/forest-00.png",
          //     },
          //     {
          //       key: "forest-41",
          //       fileName: "backgrounds/forest/forest-01.png",
          //     },
          //     {
          //       key: "forest-42",
          //       fileName: "backgrounds/forest/forest-02.png",
          //     },
          //     {
          //       key: "forest-43",
          //       fileName: "backgrounds/forest/forest-03.png",
          //     },
          //     {
          //       key: "forest-44",
          //       fileName: "backgrounds/forest/forest-04.png",
          //     },
          //     {
          //       key: "forest-45",
          //       fileName: "backgrounds/forest/forest-05.png",
          //     },
          //     {
          //       key: "forest-46",
          //       fileName: "backgrounds/forest/forest-06.png",
          //     },
          //   ],
          //   jsonFile: {
          //     key: "forest-4",
          //     fileName: "mapConfigs/forest/forest_0.json",
          //   },
          //   sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
          //   objects: [],
          //   mapAtlases: [
          //     {
          //       key: "texture",
          //       jsonFileName: "atlas/forest/texture.json",
          //       textureFileName: "atlas/forest/texture.png",
          //     },
          //   ],
          //   mapObjects: {
          //     key: "forest-4",
          //     fileName: "mapConfigs/forest/forest_0_objects.json",
          //   },
          // },
          // {
          //   id:6,
          //   backgroundFile: [
          //     {
          //       key: "forest-50",
          //       fileName: "backgrounds/forest/forest-00.png",
          //     },
          //     {
          //       key: "forest-51",
          //       fileName: "backgrounds/forest/forest-01.png",
          //     },
          //     {
          //       key: "forest-52",
          //       fileName: "backgrounds/forest/forest-02.png",
          //     },
          //     {
          //       key: "forest-53",
          //       fileName: "backgrounds/forest/forest-03.png",
          //     },
          //     {
          //       key: "forest-54",
          //       fileName: "backgrounds/forest/forest-04.png",
          //     },
          //     {
          //       key: "forest-55",
          //       fileName: "backgrounds/forest/forest-05.png",
          //     },
          //     {
          //       key: "forest-56",
          //       fileName: "backgrounds/forest/forest-06.png",
          //     },
          //   ],
          //   jsonFile: {
          //     key: "forest-5",
          //     fileName: "mapConfigs/forest/forest_0.json",
          //   },
          //   sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
          //   objects: [],
          //   mapAtlases: [
          //     {
          //       key: "texture",
          //       jsonFileName: "atlas/forest/texture.json",
          //       textureFileName: "atlas/forest/texture.png",
          //     },
          //   ],
          //   mapObjects: {
          //     key: "forest-5",
          //     fileName: "mapConfigs/forest/forest_0_objects.json",
          //   },
          // },
          // {
          //   id: 7,
          //   backgroundFile: [
          //     {
          //       key: "forest-60",
          //       fileName: "backgrounds/forest/forest-00.png",
          //     },
          //     {
          //       key: "forest-61",
          //       fileName: "backgrounds/forest/forest-01.png",
          //     },
          //     {
          //       key: "forest-62",
          //       fileName: "backgrounds/forest/forest-02.png",
          //     },
          //     {
          //       key: "forest-63",
          //       fileName: "backgrounds/forest/forest-03.png",
          //     },
          //     {
          //       key: "forest-64",
          //       fileName: "backgrounds/forest/forest-04.png",
          //     },
          //     {
          //       key: "forest-65",
          //       fileName: "backgrounds/forest/forest-05.png",
          //     },
          //     {
          //       key: "forest-66",
          //       fileName: "backgrounds/forest/forest-06.png",
          //     },
          //   ],
          //   jsonFile: {
          //     key: "forest-6",
          //     fileName: "mapConfigs/forest/forest_0.json",
          //   },
          //   sourceFiles: [{ key: "forest", fileName: "tiles/forest.png" }],
          //   objects: [],
          //   mapAtlases: [
          //     {
          //       key: "texture",
          //       jsonFileName: "atlas/forest/texture.json",
          //       textureFileName: "atlas/forest/texture.png",
          //     },
          //   ],
          //   mapObjects: {
          //     key: "forest-6",
          //     fileName: "mapConfigs/forest/forest_0_objects.json",
          //   },
          // },
        ],
      ],
    },
  ],
};
