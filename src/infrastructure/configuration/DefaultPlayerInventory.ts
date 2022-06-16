import { PlayerInventory } from "../../domain/inventory/playerInventory";

export const DefaultPlayerInventory: PlayerInventory = {
  items: ['1', null, '2'],
  money: {
    gold: 0,
    silver: 0,
    copper: 10,
  },
};
