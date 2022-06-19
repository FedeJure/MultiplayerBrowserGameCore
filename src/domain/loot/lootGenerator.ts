import { Map } from "../environment/mapConfiguration";
import { Money } from "../inventory/Money";
import { Item } from "../items/item";
import { Player } from "../player/players/player";
import { SimpleRepository } from "../repository";
import { Vector } from "../vector";
import { Loot } from "./loot";

export class LootGenerator {
  constructor(private lootsRepository: SimpleRepository<Loot>) {}
  generateLoot(
    itemIds: Item["id"][],
    money: Money,
    position: Vector,
    owner: Player["info"]["id"],
    mapId: Map["id"]
  ) {
    const loot: Loot = {
      id: Phaser.Utils.String.UUID(),
      itemIds,
      money,
      owner,
      position,
      mapId,
    };
    this.lootsRepository.save(loot.id, loot)
  }
}
