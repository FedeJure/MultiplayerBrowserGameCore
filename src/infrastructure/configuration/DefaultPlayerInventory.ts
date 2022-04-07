import { PlayerInventory } from "../../domain/items/playerInventory";

export const DefaultPlayerInventory: PlayerInventory = {
  items: [
    {
      id: 1,
      name: "Default Item",
      types: [],
      icon: "testItemIcon",
      model: "",
    },
    {
      id: 2,
      name: "Default Item",
      types: [],
      icon: "testItemIcon1",
      model: "",
    },
  ],
};
