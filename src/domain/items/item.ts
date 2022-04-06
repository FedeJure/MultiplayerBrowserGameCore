import { ItemType } from "./itemType";

export interface Item {
  id: number;
  types: ItemType[];
  icon: string;
  model: string;
  name: string;
}

export const DefaultItem: Item = {
    id: 1,
    types: [],
    icon: "Not founded item",
    model: "Not founded item",
    name: "Default Item"
}

export const TestItem: Item = {
  id: 1,
  types: [],
  icon: 'testItemIcon',
  model: '',
  name: "Default Test Item"
}