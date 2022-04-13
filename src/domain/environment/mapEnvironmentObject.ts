import { EnvironmentObject } from "../environmentObjects/environmentObject";

export interface MapEnvironmentObject {
  objectId: EnvironmentObject["id"];
  position: { x: number; y: number };
}
