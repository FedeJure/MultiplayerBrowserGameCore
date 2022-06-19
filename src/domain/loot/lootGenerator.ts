import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { Map } from "../environment/mapConfiguration";
import { Money } from "../inventory/Money";
import { Item } from "../items/item";
import { Player } from "../player/players/player";
import { SimpleRepository } from "../repository";
import { Vector } from "../vector";
import { Loot } from "./loot";
import { LootGeneratorView } from "./lootGeneratorView";

export class LootGenerator {
  constructor(
    private lootsRepository: SimpleRepository<Loot>,
    private view: LootGeneratorView
  ) {}
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
    this.lootsRepository.save(loot.id, loot);

    const lootView = this.view.createLoot(loot)
    const timeout = setTimeout(() => {
      this.lootsRepository.remove(loot.id);
      lootView.destroy()
    }, DefaultGameConfiguration.lootDuration);

    lootView.onDestroy.subscribe(() => {
      clearTimeout(timeout);
      this.lootsRepository.remove(loot.id);
    });
  }
}
