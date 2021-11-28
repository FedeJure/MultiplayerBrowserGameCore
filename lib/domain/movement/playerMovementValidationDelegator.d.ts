import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
export declare class PlayerMovementValidationDelegator implements Delegator {
    private readonly player;
    private readonly connection;
    private readonly disposer;
    private readonly stateRepository;
    private readonly inputRepository;
    private lastInputValidated;
    constructor(player: Player, connection: ServerConnection, stateRepository: PlayerStateRepository, inputRepository: PlayerInputRequestRepository);
    update(time: number, delta: number): void;
    init(): void;
    private validatePosition;
    stop(): void;
}
