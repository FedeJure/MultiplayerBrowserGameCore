import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { PlayerInfo } from "../player/playerInfo";
import { ServerConnection } from "../serverConnection";
import { DefaultItem, Item } from "./item";
import { InventoryView } from "./inventoryView";
import { SimpleRepository } from "../repository";
import { PlayerInventoryDto } from "../../infrastructure/dtos/playerInventoryDto";

export class ClientPlayerInventoryDelegator implements Delegator {
  private disposer: Disposer = new Disposer();
  constructor(
    private playerId: PlayerInfo["id"],
    private repository: SimpleRepository<PlayerInventoryDto>,
    private connection: ServerConnection,
    private items: SimpleRepository<Item>,
    private inventoryView: InventoryView
  ) {}

  init(): void {
    this.disposer.add(
      this.connection.onInventoryUpdate.subscribe(async ({ inventory }) => {
        this.repository.save(this.playerId, inventory);
        const newItems = inventory.items.filter((i) => !this.items.get(i));
        const response = await this.connection.emitGetItemDetails(newItems);
        const items = inventory.items.map(
          (id) =>
            this.items.get(id) ??
            response.items.find((item) => item.id === id) ??
            DefaultItem
        );
        this.inventoryView.saveItems(items);
      })
    );
  }

  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
