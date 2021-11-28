import { ResolvePlayerMovementWithInputs } from "../domain/actions/resolvePlayerMovementWithInput";
import { Delegator } from "../domain/delegator";
import { Player } from "../domain/player/player";
import { PlayerInput } from "../domain/player/playerInput";
import { PlayerInputRequestRepository } from "../infrastructure/repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";
export declare class ServerPlayerPresenter {
    private readonly player;
    private readonly input;
    private readonly resolveMovement;
    private readonly playerStates;
    private readonly delegators;
    private readonly inputRepository;
    constructor(player: Player, input: PlayerInput, resolveMovement: ResolvePlayerMovementWithInputs, playerStates: PlayerStateRepository, delegators: Delegator[], inputRepository: PlayerInputRequestRepository);
    update({ time, delta }: {
        time: number;
        delta: number;
    }): void;
}
