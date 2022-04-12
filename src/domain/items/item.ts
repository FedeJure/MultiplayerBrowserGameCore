import { ItemType } from "./itemType";

export interface Item {
  id: number;
  types: ItemType[];
  icon: string;
  model: string;
  name: string;
  detail: string;
}

export const DefaultItem: Item = {
  id: 1,
  types: [],
  icon: "Not founded item",
  model: "Not founded item",
  name: "Default Item",
  detail: "This item is showing due a load problem with the real item",
};

export const TestItem: Item = {
  id: 1,
  types: [],
  icon: "ui/testItem.png",
  model: "",
  name: "Default Test Item",
  detail: "This is a Test item used only for testing purpose",
};

export const TestItem1: Item = {
  id: 2,
  types: [],
  icon: "ui/testItem.png",
  model: "",
  name: "Ring of Honor",
  detail: "This is a Test item used only for testing purpose",
};
