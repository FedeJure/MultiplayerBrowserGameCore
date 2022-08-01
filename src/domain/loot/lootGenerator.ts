import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { Map } from "../environment/mapConfiguration";
import { Balance } from "../inventory/balance";
import { Item } from "../items/item";
import { ClientRemotePlayer } from "../player/players/player";
import { SimpleRepository } from "../repository";
import { Vector } from "../vector";
import { Loot } from "./loot";

export class LootGenerator {
  constructor(
    private lootsRepository: SimpleRepository<Loot>,
  ) {}
  generateLoot(
    itemIds: Item["id"][],
    balance: Balance,
    position: Vector,
    owner: ClientRemotePlayer["info"]["id"],
    mapId: Map["id"]
  ) {
    const loot: Loot = {
      id: Phaser.Utils.String.UUID(),
      itemIds,
      balance: balance.amount,
      owner,
      position,
      mapId,
      time: Date.now()
    };
    this.lootsRepository.save(loot.id, loot);

    setTimeout(() => {
      this.lootsRepository.remove(loot.id);
    }, DefaultGameConfiguration.lootDuration);
  }
}
