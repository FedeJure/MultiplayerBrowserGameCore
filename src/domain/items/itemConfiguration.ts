import { Item } from "./item";

export interface ItemConfiguration {
    items: {[key: Item['id']]: Item}
}