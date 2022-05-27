import { EntityState } from "../entity/entityState";

export interface EnemyState extends EntityState {
    inCombat: boolean
    reseting: boolean
    attacking: boolean
}
