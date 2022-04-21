import { GameEvents } from "../../infrastructure/events/gameEvents";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { EnvironmentObjectRepository } from "./environmentObjectRepository";

export class EnvironmentObjectDetailsDispatcherDelegator implements Delegator {
  constructor(
    private envObjectsRepository: EnvironmentObjectRepository,
    private connectionsRepository: SimpleRepository<ClientConnection>
  ) {}
  init(): void {
    this.connectionsRepository.onSave.subscribe((conn) => {
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
  }
  update(): void {}
}
