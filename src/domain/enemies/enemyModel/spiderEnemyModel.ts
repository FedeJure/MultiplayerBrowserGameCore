import { EnemyModel } from "./enemyModel";

export const SpiderEnemyModel: EnemyModel = {
  stats: {
    meleeDamage: 5,
    basicAttackSpeed: 1,
    maxLife: 45,
    walkSpeed: 40,
    runSpeed: 120,
    width: 25,
    height: 25,
    jumpPower: 1,
    rangedDistance: 200,
    meleeDistance: 25,
    detectionRange: 500
  },
  name: "Spider",
};
