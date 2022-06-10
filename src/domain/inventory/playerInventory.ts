import { Item } from "../items/item";
import { Money } from "./Money";

export interface PlayerInventory {
  items: Item["id"][];
  money: Money;
}

export const DefaultPlayerInventory: PlayerInventory = {
  items: [],
  money: {
    gold: 0,
    silver: 0,
    copper: 10,
  },
};
