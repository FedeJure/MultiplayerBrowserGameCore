import { Item } from "../items/item";

export interface PlayerInventoryDto {
  items: (Item["id"] | null)[];
}
