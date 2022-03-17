import { ItemsRepository } from "./itemsRepository";
import { ItemType } from "./itemType";
import { Item } from "./item";
import { ServerConnection } from "../serverConnection";

export class ClientItem implements Item {
  types: ItemType[];
  icon: string;
  model: string;
  constructor(
    readonly id: Item['id'],
    private repository: ItemsRepository,
    private connection: ServerConnection
  ) {
      const item = repository.get(id)
      if (item) {
          this.types = item.types
          this.icon = item.icon
          this.model = item.model
      }
  }
}
