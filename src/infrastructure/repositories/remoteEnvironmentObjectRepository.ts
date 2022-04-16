import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { ServerConnection } from "../../domain/serverConnection";

export class RemoteEnvironmentObjectRepository
  implements EnvironmentObjectRepository
{
  private cache: { [key: EnvironmentObject["id"]]: EnvironmentObject } = {};

  constructor(private serverConnection: ServerConnection) {}
  save() {}
  get(id: number): Promise<EnvironmentObject> {
    if (this.cache[id]) return Promise.resolve(this.cache[id]);
    return this.serverConnection
      .emitGetEnvironmentObjectsDetails([id])
      .then((response) => {
        const object = response.objects.find((o) => o?.id === id);
        if (!object)
          throw new Error(`Object with id ${id} not founded remotely`);

        return object;
      });
  }
}
