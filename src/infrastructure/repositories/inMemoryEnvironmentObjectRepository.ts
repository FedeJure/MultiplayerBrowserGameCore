import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";

export class InMemoryEnvironmentObjectRepository implements EnvironmentObjectRepository {
    private store: {[key: EnvironmentObject['id']]: EnvironmentObject} = {}
    save(object: EnvironmentObject) {
        this.store[object.id] = object
    }
    get(id:  EnvironmentObject['id']): Promise<EnvironmentObject> {
        if (!this.store[id]) throw new Error(`Object with id: ${id} not founded`);
        return Promise.resolve(this.store[id])
    }

}