import { EnvironmentObject } from "./environmentObject";

export interface EnvironmentObjectRepository {
  save(object: EnvironmentObject);
  get(id: EnvironmentObject["id"]): Promise<EnvironmentObject>;
}
