import { Map } from "../environment/mapConfiguration"
import { Item } from "../items/item"
import { PlayerInfo } from "../player/playerInfo"
import { Vector } from "../vector"

export interface Loot {
    id: string
    itemIds: (Item['id'] | undefined)[]
    balance: number
    owner: PlayerInfo['id']
    position: Vector,
    mapId: Map['id']
    time: number
}