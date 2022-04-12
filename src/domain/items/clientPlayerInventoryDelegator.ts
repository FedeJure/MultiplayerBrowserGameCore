import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { PlayerInfo } from "../player/playerInfo";
import { ServerConnection } from "../serverConnection";
import { InventoryRepository } from "./inventoryRepository";
import { ItemsRepository } from "./itemsRepository";
import { DefaultItem } from "./item";
import { InventoryView } from "./inventoryView";
import { loadAssetAsync } from "../../view/utils";

export class ClientPlayerInventoryDelegator implements Delegator {
  private disposer: Disposer = new Disposer();
  constructor(
    private playerId: PlayerInfo["id"],
    private repository: InventoryRepository,
    private connection: ServerConnection,
    private items: ItemsRepository,
    private inventoryView: InventoryView
  ) {}

  init(): void {
    
    this.disposer.add(
      this.connection.onInventoryUpdate
        .subscribe(({ inventory }) => {
          const newItems = inventory.items.filter((i) => !this.items.get(i));
          this.connection.emitGetItemDetails(newItems).subscribe((response) => {
            const items = inventory.items.map(
              (id) =>
                this.items.get(id) ??
                response.items.find((item) => item.id === id) ??
                DefaultItem
            );
            this.repository.save(this.playerId, { items });
            this.inventoryView.saveItems(items)
          });
        })
    );
  }

  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
