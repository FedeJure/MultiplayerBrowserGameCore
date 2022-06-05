import { ItemType } from "../../domain/items/itemType"

export interface UiItem {
    icon: string
    name: string
    detail: string
    types: ItemType[]
}