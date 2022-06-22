import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { ServerConnection } from "../serverConnection";
import { LocalClientPlayer } from "./players/localClientPlayer";

export class PlayerActionResolve {
  private actionProcessed = false;
  constructor(
    private player: LocalClientPlayer,
    private serverConnection: ServerConnection
  ) {
    player.input.onAction.subscribe(() => {
      this.processLoots();
      this.actionProcessed = false;
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
    const loot = loots[0]
    this.serverConnection.emitClaimLoot(loot.id, loot.itemIds.map((_, i) => i), loot.balance)
  }
}
