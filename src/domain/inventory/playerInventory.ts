import { Item } from "../items/item";
import { Money } from "./Money";

export interface PlayerInventoryDto {
  items: (Item["id"] | null)[];
  money: Money;
}

export const DefaultPlayerInventory: PlayerInventoryDto = {
  items: [],
  money: {
    gold: 0,
    silver: 0,
    copper: 10,
  },
};
