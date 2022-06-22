import { Item } from "../items/item";
import { Money } from "./Money";

export interface PlayerInventoryDto {
  items: (Item["id"] | null)[];
  moneyNumericRepresentation: number;
}

export const DefaultPlayerInventory: PlayerInventoryDto = {
  items: [],
  moneyNumericRepresentation: 10
};
