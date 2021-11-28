import { Delegator } from "../delegator";
import { Player } from "./player";
export declare class LocalPlayerRenderDelegator implements Delegator {
    private readonly player;
    constructor(player: Player);
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
}
