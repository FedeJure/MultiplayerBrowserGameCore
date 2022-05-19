import { EnemyModel } from "./enemyModel";

export const SpiderEnemyModel: EnemyModel = {
  stats: {
    meleeDamage: 1,
    basicAttackSpeed: 1,
    maxLife: 200,
    walkSpeed: 1,
    runSpeed: 2.5,
    width: 25,
    height: 37,
    jumpPower: 1,
    rangedDistance: 200,
    meleeDistance: 20,
    detectionRange: 500
  },
  name: "Spider",
};
