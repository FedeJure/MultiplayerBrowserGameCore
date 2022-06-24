import { EnemyView } from "../enemies/EnemyView";
import { PlayerView } from "../playerView";

export interface CollisionManager {
    addPlayer(player: PlayerView)
    addEnemy(enemy: EnemyView)
    addStaticGround(ground: any)
    addObject(object: any)
    addLadder(ladder: any)
    addAntiLadder(antiLadder: any)
}
