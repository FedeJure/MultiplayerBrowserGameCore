import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ServerConnection } from "../serverConnection";
import { LocalClientPlayer } from "../player/players/localClientPlayer";
import { ClientItemResolver } from "../items/clientItemResolver";
import { PlayerInventoryDto } from "./playerInventoryDto";
import { BalanceDto } from "./balanceDto";

export class ClientPlayerInventoryDelegator implements Delegator {
  private disposer: Disposer = new Disposer();

  constructor(
    private player: LocalClientPlayer,
    private connection: ServerConnection,
    private itemResolver: ClientItemResolver,
    private initialInventory: PlayerInventoryDto,
    private initialBalance: BalanceDto
  ) {}

  init(): void {
    this.processInventoryBalance(this.initialInventory, this.initialBalance);
    this.disposer.add(
      this.connection.onInitialGameState.subscribe(
        ({ localPlayer: { inventory, balance } }) =>
          this.processInventoryBalance(inventory, balance)
      )
    );
    this.disposer.add(
      this.connection.onInventoryUpdate.subscribe(({ inventory, balance }) =>
        this.processInventoryBalance(inventory, balance)
      )
    );
  }

  private async processInventoryBalance(
    inventory?: PlayerInventoryDto,
    balance?: BalanceDto
  ) {
    if (inventory) {
      const items = await this.itemResolver.getItems(inventory.items);
      this.player.inventory.setItems(items);
    }

    if (balance) {
      this.player.balance.set(balance.amount);
    }
  }

  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
