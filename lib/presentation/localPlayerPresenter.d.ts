import { Player } from "../domain/player/player";
import { PlayerInput } from "../domain/player/playerInput";
import { ServerConnection } from "../domain/serverConnection";
import { PhaserPlayerView } from "../view/playerView";
import { ClientPlayerPresenter } from "./clientPlayerPresenter";
import { ResolvePlayerMovementWithInputs } from "../domain/actions/resolvePlayerMovementWithInput";
import { ValidateStateAction } from "../domain/actions/validatePosition";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../domain/delegator";
export declare class LocalPlayerPresenter extends ClientPlayerPresenter {
    private readonly input;
    private readonly resolveMovement;
    private readonly playerStateRepository;
    private readonly delegators;
    private lastInputSended;
    private currentInput;
    constructor(view: PhaserPlayerView, input: PlayerInput, connection: ServerConnection, resolveMovement: ResolvePlayerMovementWithInputs, player: Player, validateState: ValidateStateAction, playerStateRepository: PlayerStateRepository, delegators: Delegator[]);
    renderLocalPlayer(): void;
    update({ time, delta }: {
        time: number;
        delta: number;
    }): void;
    inputHasChange(): boolean;
}
