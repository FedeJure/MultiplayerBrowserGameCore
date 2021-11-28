import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
export declare class PlayerRemoteMovementDelegator implements Delegator {
    private readonly player;
    private readonly connection;
    private readonly playerStateRepository;
    private readonly disposer;
    constructor(player: Player, connection: ServerConnection, playerStateRepository: PlayerStateRepository);
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
}
