export interface PlayerStats {
    maxLife: number,
    runSpeed: number,
    jumpPower: number,
    maxJumps: number,
    meleeDamage: number,
    basicAttackSpeed: number // attacks per second
}

export const DefaultPlayerStats: PlayerStats = {
    maxLife: 100,
    runSpeed: 5,
    jumpPower: 0.4,
    maxJumps: 2,
    meleeDamage: 20,
    basicAttackSpeed: 4,
}