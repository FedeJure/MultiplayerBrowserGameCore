import { Map } from "../environment/mapConfiguration"
import { Money } from "../inventory/Money"
import { Item } from "../items/item"
import { Player } from "../player/players/player"
import { Vector } from "../vector"

export interface Loot {
    id: string
    itemIds: Item['id'][]
    money: Money
    owner: Player['info']['id']
    position: Vector,
    mapId: Map['id']
}