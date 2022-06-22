import { Map } from "../environment/mapConfiguration"
import { Item } from "../items/item"
import { Player } from "../player/players/player"
import { Vector } from "../vector"

export interface Loot {
    id: string
    itemIds: (Item['id'] | undefined)[]
    balance: number
    owner: Player['info']['id']
    position: Vector,
    mapId: Map['id']
    time: number
}