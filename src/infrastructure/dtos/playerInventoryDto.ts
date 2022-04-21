import { Item } from "../../domain/items/item";

export interface PlayerInventoryDto {
    items: Item['id'][]
}

export const DefaultPlayerInventoryDto = {
    items: []
}
