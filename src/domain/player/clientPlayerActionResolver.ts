import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { Balance } from "../inventory/balance";
import { ClientItemResolver } from "../items/clientItemResolver";
import { Loot } from "../loot/loot";
import { LootView } from "../loot/lootView";
import { ServerConnection } from "../serverConnection";
import { LocalClientPlayer } from "./players/localClientPlayer";

export class ClientPlayerActionResolve {
  private actionProcessed = false;
  private currentLoot: Loot | undefined;
  constructor(
    private player: LocalClientPlayer,
    private serverConnection: ServerConnection,
    private view: LootView,
    private itemResolver: ClientItemResolver
  ) {
    player.input.onAction.subscribe(() => {
      this.processLoots();
      this.actionProcessed = false;
    });

    this.view.onClaimLoot.subscribe((lootToClaim) => {
      if (!this.currentLoot) return;
      this.serverConnection.emitClaimLoot(
        this.currentLoot.id,
        lootToClaim
          .filter((item) => item !== undefined)
          .map((item) =>
            this.currentLoot!.itemIds.findIndex((id) => id === item!.id)
          ),
        this.currentLoot.balance
      );
    });
  }

  processLoots() {
    const loots = this.player.view.combatCollisionResolver.getLootsOnDistance(
      this.player.state.position.x,
      this.player.state.position.y,
      DefaultGameConfiguration.lootDistance
    );
    if (loots.length === 0) return;
    this.actionProcessed = true;
    this.currentLoot = loots[0];

    this.itemResolver.getItems(this.currentLoot.itemIds).then((items) => {
      const balance = new Balance()
      balance.set(this.currentLoot?.balance ?? 0)
      this.view.showWith(items, balance.gameMoney);
      this.view.onClaimLoot;
    });
  }
}
