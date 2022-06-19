import { EnemyModel } from "./enemyModel";

export const SpiderEnemyModel: EnemyModel = {
  lootConfigId: 'simpleLoot',
  stats: {
    level: 1,
    meleeDamage: 5,
    basicAttackSpeed: 1,
    maxLife: 45,
    walkSpeed: 40,
    runSpeed: 120,
    width: 30,
    height: 30,
    jumpPower: 1,
    rangedDistance: 200,
    meleeDistance: 40,
    detectionRange: 500
  },
  name: "Spider",
};
