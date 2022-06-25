import { GameObjects } from "phaser";
import { EnemyView } from "../enemies/EnemyView";
import { PlayerView } from "../playerView";

export interface CollisionManager {
    addPlayer(player: PlayerView)
    addEnemy(enemy: EnemyView)
    addStaticGround(ground: GameObjects.GameObject)
    addObject(object: GameObjects.GameObject)
    addLadder(ladder: GameObjects.GameObject)
    addEntrance(entrance: GameObjects.GameObject)
    addExit(exit: GameObjects.GameObject)
}
