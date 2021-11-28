import { Observable, Subject } from "rxjs";
import { CollisionData } from "./collisionData";
declare type CollisionStartEvent = Phaser.Physics.Matter.Events.CollisionStartEvent;
declare type CollisionEndEvent = Phaser.Physics.Matter.Events.CollisionEndEvent;
export declare class CollisionsDispatcher {
    subscriptions: Map<string, Subject<CollisionData>>;
    constructor();
    subscribeToCollision(id: string): Observable<CollisionData>;
    sendCollisionStart(anEvent: CollisionStartEvent): void;
    sendCollisionEnd(anEvent: CollisionEndEvent): void;
    private sendEventToBody;
}
export {};
