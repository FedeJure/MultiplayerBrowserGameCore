import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";
import { ResolvePlayerMovementWithInputs } from "../actions/resolvePlayerMovementWithInput";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
export declare class PlayerInputDelegator implements Delegator {
    private readonly connection;
    private readonly statesRepository;
    private readonly player;
    private readonly input;
    private readonly resolveMovement;
    private readonly inputRequestRepository;
    private currentInput;
    private lastInputSended;
    private savedState;
    constructor(player: Player, input: PlayerInput, connection: ServerConnection, statesRepository: PlayerStateRepository, resolveMovement: ResolvePlayerMovementWithInputs, inputRequestRepository: PlayerInputRequestRepository);
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
    inputHasChange(): boolean;
}
