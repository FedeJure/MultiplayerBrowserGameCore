import { Scene } from "phaser";
import { CollisionableEntity } from "../../domain/entity/CollisionableEntity";
import { CombatCollisionResolver } from "../../domain/player/combat/combatCollisionResolver";
import { SimpleRepository } from "../../domain/repository";
import { Vector } from "../../domain/vector";
import { ViewObjectType } from "../../domain/viewObject";

export class PhaserCombatCollisionResolver implements CombatCollisionResolver {
  constructor(
    x: number,
    y: number,
    private scene: Scene,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>
  ) {}

  getTargetsAround(x: number, y: number, distance: number) {
    const bodies = this.scene.physics.overlapCirc(
      x - distance / 2,
      y - distance / 2,
      distance
    );
    return bodies
      .map((body) =>
        this.collisionableTargetRepository.get(
          (body as Phaser.Physics.Arcade.Body).gameObject.getData("id")
        )
      )
      .filter((target) => target !== undefined) as CollisionableEntity[];
  }

  getPlatformDetectorsAround(x: number, y: number, distance: number): Vector[] {
    const bodies = this.scene.physics.overlapCirc(
      x - distance / 2,
      y - distance / 2,
      distance,
      false,
      true
    ) as Phaser.Physics.Arcade.StaticBody[];
    return bodies
      .filter((body) => {
        return (
          body.gameObject.getData("type") === ViewObjectType.PlatformDetector
        );
      })
      .map((body) => body.position);
  }

  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): CollisionableEntity[] {
    const bodies = this.scene.physics.overlapRect(x, y, width, height);
    // this.drawDebugRectangle(x, y, width, height);
    return bodies
      .map((body) =>
        this.collisionableTargetRepository.get(
          (body as Phaser.Physics.Arcade.Body).gameObject.getData("id")
        )
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
