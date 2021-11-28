import { CollisionData } from "../view/collisions/collisionData";
import { CollisionsDispatcher } from "../view/collisions/collisionsDispatcher";
import { CollisionCategory } from "../view/collisions/collisionTypes";
import { PhaserPlayerView } from "../view/playerView";
export declare class PlayerCollisionDelegator {
    readonly collisionsDispatcher: CollisionsDispatcher;
    readonly handlersMap: Map<CollisionCategory, (col: CollisionData) => void>;
    constructor(collisionsDispatcher: CollisionsDispatcher, view: PhaserPlayerView);
    private handleStaticEnvCollision;
}
