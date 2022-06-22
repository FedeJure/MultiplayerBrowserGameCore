import { SimpleRepository } from "../repository";
import { ServerConnection } from "../serverConnection";
import { Item } from "./item";

export class ClientItemResolver {
  constructor(
    private connection: ServerConnection,
    private itemsRepository: SimpleRepository<Item>
  ) {}

  async getItems(ids: (Item["id"] | undefined)[]) {
    const newItems = ids.filter(
      (i) => i !== undefined && !this.itemsRepository.get(i)
    ) as string[];
    const response = await this.connection.emitGetItemDetails(newItems);
    const items = ids.map((id) =>
      id !== undefined
        ? this.itemsRepository.get(id) ??
          response.items.find((item) => item.id === id) ??
          undefined
        : undefined
    );
    return items;
  }
}
