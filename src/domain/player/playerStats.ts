import { EntityStats } from "../entity/entityStats";

export interface PlayerStats extends EntityStats {
  maxLife: number;
  runSpeed: number;
  jumpPower: number;
  maxJumps: number;
  meleeDamage: number;
  basicAttackSpeed: number; // attacks per second
}

export const DefaultPlayerStats: PlayerStats = {
  maxLife: 100,
  runSpeed: 150,
  jumpPower: 18,
  maxJumps: 2,
  meleeDamage: 20,
  basicAttackSpeed: 2.5,
  walkSpeed: 50,
  meleeDistance: 20,
  rangedDistance: 200
};
