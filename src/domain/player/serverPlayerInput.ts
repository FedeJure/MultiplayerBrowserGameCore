import { Observable } from "rxjs";
import { Vector } from "../vector";
import { PlayerInput } from "./playerInput";

export interface ServerPlayerInput extends PlayerInput {
    onClientPositionReceived: Observable<Vector>
}