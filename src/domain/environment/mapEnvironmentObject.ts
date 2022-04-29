import { EnvironmentObject } from "../environmentObjects/environmentObject";
import { Vector } from "../vector";

export interface MapEnvironmentObject {
  object: EnvironmentObject;
  position: Vector;
}
