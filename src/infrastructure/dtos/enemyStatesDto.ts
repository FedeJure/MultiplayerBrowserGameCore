import { EnemyInfo } from "../../domain/enemies/EnemyInfo";
import { EnemyState } from "../../domain/enemies/EnemyState";

export interface EnemyStatesDto {
    states: {state: EnemyState, info: EnemyInfo}[]
}