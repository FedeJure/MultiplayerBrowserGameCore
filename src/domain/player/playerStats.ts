import { EntityStats } from "../entity/entityStats";

export interface PlayerStats extends EntityStats {
  inventorySize: number;
  maxLife: number;
  runSpeed: number;
  jumpPower: number;
  maxJumps: number;
  meleeDamage: number;
  basicAttackSpeed: number; // attacks per second
}

export const DefaultPlayerStats: PlayerStats = {
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
