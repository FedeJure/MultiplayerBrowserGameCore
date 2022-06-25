import { Vector } from "../vector";
import { Entrance } from "./entrance";
import { Map } from "./mapConfiguration";

export interface Exit {
  id: string;
  actionRequired: boolean;
  destinationMapId: Map["id"];
  destinationEntranceId: Entrance["id"];
  position: Vector,
  height: number
  width: number
}
