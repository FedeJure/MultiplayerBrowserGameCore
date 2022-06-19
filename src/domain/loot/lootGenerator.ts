import { Money } from "../inventory/Money";
import { Item } from "../items/item";
import { Player } from "../player/players/player";
import { Vector } from "../vector";

export class LootGenerator {
  generateLoot(
    items: Item["id"][],
    money: Money,
    position: Vector,
    owner: Player["info"]["id"]
  ) {
    console.log(items,money, position, owner)
  }
}
