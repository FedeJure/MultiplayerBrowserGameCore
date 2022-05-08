import { CombatResult } from "../player/combat/combatResult";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";

export interface Enemy {
  readonly state: EnemyState;
  readonly info: EnemyInfo;
  readonly stats: EnemyStats;
  receiveAttack(attack: CombatResult);
  update(time: number, delta: number);
}
