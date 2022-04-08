import { BodyType } from 'matter'
import { Observable, Subject } from 'rxjs'
import { CollisionCategory, CollisionGroups } from '../domain/collisions/collisionTypes'

export class CollisionDetector  {
    private activeCollisions: {[key: number]: true} = {}
    private activeCollisionsCount: number = 0
    private readonly _onCollideChange: Subject<boolean> = new Subject<boolean>()
    constructor(public readonly body: BodyType) {
        body.isSensor = true
        body.label = "CollisionDetector"
        body.onCollideCallback = this.handleCollisionStart.bind(this)
        body.onCollideEndCallback = this.handleCollisionEnd.bind(this)
        body.collisionFilter = { category: CollisionCategory.Player , group: CollisionGroups.Player, mask: CollisionCategory.StaticEnvironment}

    }

    private handleCollisionStart(pair: Phaser.Types.Physics.Matter.MatterCollisionPair) {
        if (!this.activeCollisions[pair.bodyB.id]) {
            this.activeCollisions[pair.bodyB.id] = true
            if (this.activeCollisionsCount === 0) this._onCollideChange.next(true)
            this.activeCollisionsCount ++
        }
    }

    private handleCollisionEnd(pair: Phaser.Types.Physics.Matter.MatterCollisionPair) {

        if (this.activeCollisions[pair.bodyB.id]) {
            delete this.activeCollisions[pair.bodyB.id]
            this.activeCollisionsCount --
            if (this.activeCollisionsCount === 0) this._onCollideChange.next(false)
        }
    }

    public get onCollideChange() : Observable<boolean> {
        return this._onCollideChange
    }

}