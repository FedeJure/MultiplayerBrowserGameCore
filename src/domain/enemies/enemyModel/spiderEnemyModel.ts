import { EnemyModel } from "./enemyModel";

export const SpiderEnemyModel: EnemyModel = {
  stats: {
    maxLife: 200,
    baseAttack: 1,
    baseDefense: 0,
    attackSpeed: 1,
    idleMovementSpeed: 1,
    combatingMovementSpeed: 2.5,
    width: 25,
    height: 37,
  },
  name: "Spider",
};
