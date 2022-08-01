import { Entity } from "../../entity/entity";
import { EntityMovement } from "../../entity/entityMovement";
import { Side } from "../../side";

export class ClientRemotePlayerMovement implements EntityMovement {
  private entity: Entity;
  init(entity: Entity) {
    this.entity = entity;
  }
  update(time: number, delta: number) {
    if (
      Phaser.Math.Distance.BetweenPoints(
        this.entity.view.positionVector,
        this.entity.state.position
      ) > 15
    ) {
      this.entity.view.setPosition(
        this.entity.state.position.x,
        this.entity.state.position.y
      );
    }
    this.entity.view.setVelocity(
      this.entity.state.velocity.x,
      this.entity.state.velocity.y
    );
    this.entity.view.lookToLeft(this.entity.state.side === Side.LEFT);
  }
}
