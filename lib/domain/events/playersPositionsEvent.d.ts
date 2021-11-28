import { Position } from "../position";
export interface PlayersPositionsEvents {
    time: Date;
    positions: {
        id: number;
        position: Position;
    }[];
}
