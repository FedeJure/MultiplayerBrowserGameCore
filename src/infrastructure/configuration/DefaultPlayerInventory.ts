import { PlayerInventory } from "../../domain/items/playerInventory";

export const DefaultPlayerInventory: PlayerInventory = {
  items: [
    {
      id: 1,
      name: "Default Item",
      types: [],
      icon: "testItemIcon",
      model: "",
      detail: "This is a Test item used only for testing purpose"

    },
    {
      id: 2,
      name: "Default Item",
      types: [],
      icon: "testItemIcon1",
      model: "",
      detail: "This is a Test item used only for testing purpose"
    },
  ],
};
