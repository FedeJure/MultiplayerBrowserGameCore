import { Item } from "../../domain/items/item";
import { ItemsRepository } from "../../domain/items/itemsRepository";

export class InMemoryItemsRepository implements ItemsRepository {
  private store: { [key: Item['id']]: Item } = {};
  get(itemId: Item['id']): Item {
    return this.store[itemId];
  }
}
