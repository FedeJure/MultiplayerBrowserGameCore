import { Vector } from "../vector";
import { Entrance } from "./entrance";
import { Exit } from "./exit";
import { Map } from "./mapConfiguration";
import { SpawnPoint } from "./spawnPoint";

export interface ProcessedMap {
  config: Map
  layerId: number;
  id: number;
  originX: number;
  originY: number;
  height: number;
  width: number;
  leftMapId: number | undefined;
  rightMapId: number | undefined;
  topMapId: number | undefined;
  bottomMapId: number | undefined;
  leftTopMapId: number | undefined;
  rightTopMapId: number | undefined;
  leftBottomMapId: number | undefined;
  rightBottomMapId: number | undefined;
  spawnPositions: SpawnPoint[]
  entrances: Entrance[]
  exits: Exit[]
}
