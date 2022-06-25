import { Side } from "../side";
import { Entity } from "./entity";
import { EntityMovement } from "./entityMovement";
export class DefaultEntityMovement implements EntityMovement {
    private entity: Entity
  init(entity: Entity) {
    this.entity = entity
  }
  update(time: number, delta: number) {
    this.entity.view.playAnimations(this.entity.state.anim);
    this.entity.view.setPosition(this.entity.state.position.x, this.entity.state.position.y);
    this.entity.view.setVelocity(this.entity.state.velocity.x, this.entity.state.velocity.y);
    this.entity.view.lookToLeft(this.entity.state.side === Side.LEFT);
  }
}
