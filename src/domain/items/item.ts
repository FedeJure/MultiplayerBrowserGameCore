import { ItemType } from "./itemType";

export interface Item {
  id: string;
  types: ItemType[];
  icon: string;
  model: string;
  name: string;
  detail: string;
}

export const DefaultItem: Item = {
  id: "1",
  types: [],
  icon: "Not founded item",
  model: "Not founded item",
  name: "Default Item",
  detail: "This item is showing due a load problem with the real item",
};
