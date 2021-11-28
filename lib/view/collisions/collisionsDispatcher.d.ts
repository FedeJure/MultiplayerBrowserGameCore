import { Observable, Subject } from "rxjs";
import { CollisionData } from "../../domain/collisions/collisionData";
declare type CollisionStartEvent = Phaser.Physics.Matter.Events.CollisionStartEvent;
export declare class CollisionsDispatcher {
    subscriptions: Map<number, Subject<CollisionData>>;
    constructor();
    subscribeToStartCollision(bodyId: number): Observable<CollisionData>;
    sendCollisionStart(anEvent: CollisionStartEvent): void;
    private sendEventToBody;
}
export {};
