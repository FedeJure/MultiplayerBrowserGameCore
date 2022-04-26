export interface PlayerStats {
    maxLife: number,
    runSpeed: number,
    jumpPower: number,
    maxJumps: number
}

export const DefaultPlayerStats: PlayerStats = {
    maxLife: 100,
    runSpeed: 5,
    jumpPower: 0.4,
    maxJumps: 2
}