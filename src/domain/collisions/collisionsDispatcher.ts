import { Observable, Subject } from "rxjs";
import { CollisionData } from "./collisionData";
import { CollisionType } from "./collisionTypes";

type CollisionStartEvent = Phaser.Physics.Matter.Events.CollisionStartEvent;
type CollisionEndEvent = Phaser.Physics.Matter.Events.CollisionEndEvent;
type MatterCollisionData = Phaser.Types.Physics.Matter.MatterCollisionData;

export class CollisionsDispatcher {
  subscriptions: Map<string, Subject<CollisionData>> = new Map();

  constructor() {}

  public subscribeToCollision(id: string): Observable<CollisionData> {
    const subject = new Subject<CollisionData>();
    this.subscriptions.set(id, subject);
    return subject;
  }

  public sendCollisionStart(anEvent: CollisionStartEvent) {
    anEvent.pairs.forEach((pair) => {
      this.sendEventToBody(pair.bodyA, pair.bodyB, pair, CollisionType.Start);
      this.sendEventToBody(pair.bodyB, pair.bodyA, pair, CollisionType.Start);
    });
  }

  public sendCollisionEnd(anEvent: CollisionEndEvent) {
    anEvent.pairs.forEach((pair) => {
      this.sendEventToBody(pair.bodyA, pair.bodyB, pair, CollisionType.End);
      this.sendEventToBody(pair.bodyB, pair.bodyA, pair, CollisionType.End);
    });
  }

  private sendEventToBody(
    bodySource: MatterJS.BodyType,
    bodyTarget: MatterJS.BodyType,
    event: MatterCollisionData,
    type: CollisionType
  ) {
    const subject = this.subscriptions.get(bodySource.id.toString());
    if (subject) subject.next(createData(event, bodyTarget, type));
  }
}

function createData(
  data: MatterCollisionData,
  bodyTarget: MatterJS.BodyType,
  type: CollisionType
): CollisionData {
  return {
    normal: (data as any).collision.normal,
    tangent: (data as any).collision.tangent,
    collidedCategory: bodyTarget.collisionFilter.category,
    type
  };
}
