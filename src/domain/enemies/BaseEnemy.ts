import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./Enemy";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class BaseEnemy implements Enemy {
  constructor(
    readonly state: EnemyState,
    readonly info: EnemyInfo,
    readonly stats: EnemyStats,
    readonly view: EnemyView
  ) {}
  receiveAttack(attack: CombatResult) {
  }
  update(time: number, delta: number) {
      
  }

  
}
