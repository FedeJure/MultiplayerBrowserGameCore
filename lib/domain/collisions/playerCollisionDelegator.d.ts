import { CollisionsDispatcher } from "./collisionsDispatcher";
import { Delegator } from "../delegator";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Player } from "../player/player";
export declare class PlayerCollisionDelegator implements Delegator {
    private readonly collisionsDispatcher;
    private readonly player;
    private readonly statesRepository;
    private readonly handlersMap;
    private readonly disposer;
    constructor(player: Player, collisionsDispatcher: CollisionsDispatcher, statesRepository: PlayerStateRepository);
    update(time: number, delta: number): void;
    init(): void;
    stop(): void;
    private handleStaticEnvCollisionStart;
    private handleStaticEnvCollisionEnd;
}
