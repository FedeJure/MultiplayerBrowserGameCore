import { ClientConnection } from "../../domain/clientConnection";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
export declare class PlayerSocketInput implements PlayerInput {
    private _up;
    private _down;
    private _left;
    private _right;
    private _jump;
    constructor(playerId: string, connection: ClientConnection, inputRequestRepository: PlayerInputRequestRepository);
    toDto(): PlayerInputDto;
    get up(): boolean;
    get down(): boolean;
    get left(): boolean;
    get right(): boolean;
    get jump(): boolean;
}
