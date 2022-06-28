import { Vector } from "../vector";
import { MapEnvironmentObject } from "./mapEnvironmentObject";

export interface MapConfiguration {
  singleMapSize: Vector;
  patronSizeInPixels: number;
  mapLayers: MapLayer[];
  layerNames: {
    colliders: string;
    ground: string;
    objects: string;
    spawnPositions: string;
    entrances: string;
    exits: string;
  };
}

export interface MapLayer {
  id: number;
  mapsInOrder: Map[][];
}

export interface Map {
  id: number;
  backgroundFile: { key: string; fileName: string }[];
  jsonFile: { key: string; fileName: string };
  sourceFiles: { key: string; fileName: string }[];
  objects: MapEnvironmentObject[];
  mapAtlases: { key: string; jsonFileName: string; textureFileName: string }[];
  mapObjects: { key: string, fileName: string };
}

/*
Example: 

mapsInOrder:[ [0,1,2] , [3,4,5], [6,7,8] ]  

== >    | 0  1  2 |    map 4 have map 3 on left, map 1 on top and that with all maps...
        | 3  4  5 |
        | 6  7  8 |
              */
