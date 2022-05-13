import { EnemyModel } from "./enemyModel";

export const SpiderEnemyModel: EnemyModel = {
  stats: {
    maxLife: 200,
    baseAttack: 1,
    baseDefense: 0,
    attackSpeed: 1,
    idleMovementSpeed: 5,
    combatingMovementSpeed: 2.5,
  },
  info: {
    id: "spider",
    name: "Spider",
  },
  width: 60,
  height: 60,
};
