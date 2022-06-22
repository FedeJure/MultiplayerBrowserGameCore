import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { LootCreator } from "./lootCreator";

export class ClientLootUpdaterDelegator implements Delegator {
  constructor(
    private serverConnection: ServerConnection,
    private lootCreator: LootCreator
  ) {}
  init(): void {
    this.serverConnection.onLootsAppear.subscribe(({ loots }) => {
      loots.forEach((loot) => this.lootCreator.createOrUpdateLoot(loot));
    });

    this.serverConnection.onLootsDisappear.subscribe(({ loots }) => {
      loots.forEach((loot) => this.lootCreator.destroyLoot(loot.id));
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
