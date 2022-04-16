import { GameEvents } from "../../infrastructure/events/gameEvents";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { Delegator } from "../delegator";
import { EnvironmentObjectRepository } from "./environmentObjectRepository";

export class EnvironmentObjectDetailsDispatcherDelegator implements Delegator {
  constructor(
    private envObjectsRepository: EnvironmentObjectRepository,
    private connectionsRepository: ConnectionsRepository
  ) {}
  init(): void {
    this.connectionsRepository.onNewConnection().subscribe((conn) => {
      conn.onEnvironmentObjectRequest().subscribe(({ ev, callback }) => {
        Promise.all(ev.objectIds.map((id) => this.envObjectsRepository.get(id)))
          .then((objects) =>
            GameEvents.ENVIRONMENT_OBJECT_DETAILS_RESPONSE.getEvent(objects)
          )
          .then(ev => callback(ev));
      });
    });
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {}
}
