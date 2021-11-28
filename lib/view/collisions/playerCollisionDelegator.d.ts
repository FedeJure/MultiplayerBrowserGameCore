import { CollisionsDispatcher } from "./collisionsDispatcher";
import { PhaserPlayerView } from "../playerView";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { CollisionData } from "../../domain/collisions/collisionData";
export declare class PlayerCollisionDelegator {
    readonly collisionsDispatcher: CollisionsDispatcher;
    readonly handlersMap: Map<CollisionCategory, (col: CollisionData) => void>;
    constructor(collisionsDispatcher: CollisionsDispatcher, view: PhaserPlayerView);
    private handleStaticEnvCollision;
}
