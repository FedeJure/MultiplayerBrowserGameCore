import { BodyType } from "matter";
import { Scene } from "phaser";
import { CollisionableEntity } from "../../domain/entity/CollisionableEntity";
import { CombatCollisionResolver } from "../../domain/player/combat/combatCollisionResolver";
import { SimpleRepository } from "../../domain/repository";

export class PhaserCombatCollisionResolver implements CombatCollisionResolver {
  constructor(
    x: number,
    y: number,
    private scene: Scene,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>
  ) {}

  getTargetsAround(x: number, y: number, distance: number) {
    const bodies = this.scene.matter.intersectRect(
      x - (distance / 2),
      y - (distance / 2),
      distance,
      distance
    );
    return bodies
      .map((body) =>
        this.collisionableTargetRepository.get((body as BodyType).id.toString())
      )
      .filter((target) => target !== undefined) as CollisionableEntity[];
  }

  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): CollisionableEntity[] {
    const bodies = this.scene.matter.intersectRect(x, y, width, height);
    // this.drawDebugRectangle(x, y, width, height);
    return bodies
      .map((body) =>
        this.collisionableTargetRepository.get((body as BodyType).id.toString())
      )
      .filter((target) => target !== undefined) as CollisionableEntity[];
  }

  private drawDebugRectangle(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const rect = this.scene.add.rectangle(
      x + width / 2,
      y,
      width,
      height,
      0xff0000
    );
    this.scene.time.delayedCall(500, () => rect.destroy());
  }
}
