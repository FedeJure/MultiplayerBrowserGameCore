import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ServerConnection } from "../serverConnection";
import { LocalClientPlayer } from "../player/players/localClientPlayer";
import { ClientItemResolver } from "../items/clientItemResolver";

export class ClientPlayerInventoryDelegator implements Delegator {
  private disposer: Disposer = new Disposer();

  constructor(
    private player: LocalClientPlayer,
    private connection: ServerConnection,
    private itemResolver: ClientItemResolver
  ) {}

  init(): void {
    this.disposer.add(
      this.connection.onInventoryUpdate.subscribe(
        async ({ inventory, balance }) => {
          if (inventory) {
            const items = await this.itemResolver.getItems(inventory.items);
            this.player.inventory.setItems(items);
          }

          if (balance) {
            this.player.balance.set(balance.amount);
          }
        }
      )
    );
  }

  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
