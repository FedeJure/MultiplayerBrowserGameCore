import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ServerConnection } from "../serverConnection";
import { DefaultItem, Item } from "../items/item";
import { SimpleRepository } from "../repository";
import { LocalCLientPlayer } from "../player/players/localClientPlayer";

export class ClientPlayerInventoryDelegator implements Delegator {
  private disposer: Disposer = new Disposer();
  
  constructor(
    private player: LocalCLientPlayer,
    private connection: ServerConnection,
    private items: SimpleRepository<Item>,
  ) {
  }

  init(): void {
    this.disposer.add(
      this.connection.onInventoryUpdate.subscribe(async ({ inventory, balance }) => {
        if (inventory) {
          const newItems = inventory.items.filter((i) => i !== null && !this.items.get(i)) as string[];
          const response = await this.connection.emitGetItemDetails(newItems);
          const items = inventory.items.map(
            (id) =>
              id !== null ?
              this.items.get(id) ??
              response.items.find((item) => item.id === id) ??
              DefaultItem : null
          );
          this.player.inventory.setItems(items)
        }

        if (balance) {
          this.player.balance.set(balance.amount)
        }

      })
    );
  }

  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
