import { BodyType } from "matter";
import { Scene } from "phaser";
import { AttackTarget } from "../../domain/combat/attackTarget";
import { CombatCollisionResolver } from "../../domain/player/combat/combatCollisionResolver";
import { SimpleRepository } from "../../domain/repository";

export class PhaserCombatCollisionResolver implements CombatCollisionResolver {
  constructor(
    x: number,
    y: number,
    private scene: Scene,
    private attackTargetRepository: SimpleRepository<AttackTarget>
  ) {}

  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): AttackTarget[] {
    const bodies = this.scene.matter.intersectRect(x, y, width, height);
    return bodies
      .map((body) =>
        this.attackTargetRepository.get((body as BodyType).id.toString())
      )
      .filter((target) => target !== undefined) as AttackTarget[];
  }
}
