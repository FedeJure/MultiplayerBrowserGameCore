import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
export declare class RemotePlayerAnimationDelegator implements Delegator {
    protected readonly statesRepository: PlayerStateRepository;
    protected readonly player: Player;
    constructor(player: Player, statesRepository: PlayerStateRepository);
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
}
