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
              { key: "forest-00", fileName: "backgrounds/forest/forest-00.png" },
              { key: "forest-01", fileName: "backgrounds/forest/forest-01.png" },
              { key: "forest-02", fileName: "backgrounds/forest/forest-02.png" },
              { key: "forest-03", fileName: "backgrounds/forest/forest-03.png" },
              { key: "forest-04", fileName: "backgrounds/forest/forest-04.png" },
              { key: "forest-05", fileName: "backgrounds/forest/forest-05.png" },
              { key: "forest-06", fileName: "backgrounds/forest/forest-06.png" },
            ],
            jsonFile: {
              key: "forest-0",
              fileName: "mapConfigs/forest/forest_0.json",
            },
            sourceFiles: [
              { key: "forest", fileName: "tiles/forest.png" },
              { key: "farm", fileName: "tiles/farm.png" },
            ],
            objects: [],
            mapAtlases: [{key: 'texture', jsonFileName: 'atlas/forest/texture.json', textureFileName: 'atlas/forest/texture.png'}],
            mapObjects: {key: 'forest-0', fileName: 'mapConfigs/forest/forest_2_village_config.json'}
          },
          {
            id: 1,
            backgroundFile: [
              { key: "forest-10", fileName: "backgrounds/forest/forest-00.png" },
              { key: "forest-11", fileName: "backgrounds/forest/forest-01.png" },
              { key: "forest-12", fileName: "backgrounds/forest/forest-02.png" },
              { key: "forest-13", fileName: "backgrounds/forest/forest-03.png" },
              { key: "forest-14", fileName: "backgrounds/forest/forest-04.png" },
              { key: "forest-15", fileName: "backgrounds/forest/forest-05.png" },
              { key: "forest-16", fileName: "backgrounds/forest/forest-06.png" },
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
            mapAtlases: [{key: 'village', jsonFileName: 'atlas/forest/village.json', textureFileName: 'atlas/forest/village.png'}],
            mapObjects: {key: 'forest-village', fileName: 'mapConfigs/forest/forest_2_village_config.json'}
          },
        ],
      ],
    },
  ],
};
