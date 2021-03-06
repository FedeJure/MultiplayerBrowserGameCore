export interface EntityStats {
  readonly maxLife: number;
  readonly runSpeed: number;
  readonly walkSpeed: number;
  readonly jumpPower: number;
  readonly meleeDamage: number;
  readonly basicAttackSpeed: number; // attacks per second
  readonly meleeDistance: number;
  readonly rangedDistance: number;
  readonly level: number
}