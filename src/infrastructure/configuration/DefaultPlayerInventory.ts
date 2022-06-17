import { PlayerInventoryDto } from "../../domain/inventory/playerInventoryDto";

export const DefaultPlayerInventory: PlayerInventoryDto = {
  items: ['1', null, '2'],
  money: {
    gold: 0,
    silver: 0,
    copper: 10,
  },
};
