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
  runSpeed: 5,
  jumpPower: 0.4,
  maxJumps: 2,
  meleeDamage: 20,
  basicAttackSpeed: 2.5,
  walkSpeed: 2.5,
};
