import { ItemType } from "./itemType";

export interface Item {
  id: number;
  types: ItemType[];
  icon: string;
  model: string;
}

export const DefaultItem: Item = {
    id: 1,
    types: [],
    icon: "Not founded item",
    model: "Not founded item"
}

export const TestItem: Item = {
  id: 1,
  types: [],
  icon: 'testItemIcon',
  model: ''
}