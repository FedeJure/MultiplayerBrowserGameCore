import { Item } from "./item";

export interface ItemsRepository {
    get(id: Item['id']): Item | null
    save(item: Item)
}