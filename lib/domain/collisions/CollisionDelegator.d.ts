import { Delegator } from "../delegator";
import { CollisionsDispatcher } from "./collisionsDispatcher";
export declare class CollisionDelegator implements Delegator {
    private readonly collisionsDispatcher;
    constructor(collisionDispatcher: CollisionsDispatcher);
    init(): void;
    stop(): void;
}
