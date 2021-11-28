import { CreateClientPlayerAction } from "../domain/actions/provideClientPlayer";
import { CreateLocalClientPlayer } from "../domain/actions/provideLocalClientPlayer";
import { CreatePlayerFromId } from "../domain/actions/providePlayerFromId";
import { ResolvePlayerMovementWithInputs } from "../domain/actions/resolvePlayerMovementWithInput";
import { ValidateStateAction } from "../domain/actions/validatePosition";
export declare class ActionProvider {
    static get CreateClientPlayer(): CreateClientPlayerAction;
    static get CreateLocalClientPlayer(): CreateLocalClientPlayer;
    static get CreatePlayerFromId(): CreatePlayerFromId;
    static get ResolvePlayerMovementWithInputs(): ResolvePlayerMovementWithInputs;
    static get ValidatePosition(): ValidateStateAction;
}
