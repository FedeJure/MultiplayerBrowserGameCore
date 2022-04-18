import { EnvironmentObject } from "../environmentObjects/environmentObject";

export interface MapEnvironmentObject {
  object: EnvironmentObject;
  position: { x: number; y: number };
}
