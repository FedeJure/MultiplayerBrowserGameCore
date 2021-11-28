import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
import { AnimationCode } from "./animations";
export declare class ServerPlayerAnimationDelegator implements Delegator {
    protected readonly statesRepository: PlayerStateRepository;
    protected readonly player: Player;
    constructor(player: Player, statesRepository: PlayerStateRepository);
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
    protected getAnimation(state: PlayerState): AnimationCode.IDLE | AnimationCode.RUNNING | AnimationCode.IDLE_JUMP | AnimationCode.RUNNING_JUMP | AnimationCode.FALLING;
}
