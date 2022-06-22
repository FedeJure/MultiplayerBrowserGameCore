import { Money } from "../inventory/Money"
import { Item } from "../items/item"

export interface ItemLootConfiguration {
    itemId: Item['id']
    probability: number
}

export interface LootConfiguration {
    id: string
    items: ItemLootConfiguration[]
    minItems: number
    maxItems: number
    minMoney: number
    maxMoney: number
}