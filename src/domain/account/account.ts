import { PlayerInfo } from "../player/playerInfo";

export interface Account {
    id: string,
    email: string,
    hashedPassword: string,
    creationDate: number,
    playerId?: PlayerInfo['id']
}