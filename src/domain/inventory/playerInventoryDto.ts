import { Item } from "../items/item";

export interface PlayerInventoryDto {
  items: (Item["id"] | null)[];
  balance: number;
}

export const DefaultPlayerInventory: PlayerInventoryDto = {
  items: [],
  balance: 10
};
