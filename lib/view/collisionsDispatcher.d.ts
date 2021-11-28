import { Observable, Subject } from "rxjs";
export declare class CollisionsDispatcher {
    subscriptions: Map<number, Subject<Phaser.Physics.Matter.Events.CollisionStartEvent>>;
    constructor();
    subscribeToStartCollision(bodyId: number): Observable<Phaser.Physics.Matter.Events.CollisionStartEvent>;
    sendCollisionStart(anEvent: Phaser.Physics.Matter.Events.CollisionStartEvent): void;
    private sendEventToBody;
}
