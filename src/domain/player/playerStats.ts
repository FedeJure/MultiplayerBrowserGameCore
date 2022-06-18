import { EntityStats } from "../entity/entityStats";

export interface PlayerStats extends EntityStats {
  inventorySize: number;
  maxLife: number;
  runSpeed: number;
  jumpPower: number;
  maxJumps: number;
  meleeDamage: number;
  basicAttackSpeed: number; // attacks per second
  exp: number
}

export const DefaultPlayerStats: PlayerStats = {
  exp: 0,
  level: 1,
  maxLife: 100,
  runSpeed: 200,
  jumpPower: 20,
  maxJumps: 2,
  meleeDamage: 20,
  basicAttackSpeed: 2.5,
  walkSpeed: 100,
  meleeDistance: 20,
  rangedDistance: 200,
  inventorySize: 20
};
