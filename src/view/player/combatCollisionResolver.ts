import { Scene } from "phaser";
import { filter, map, Observable } from "rxjs";
import { AttackTarget } from "../../domain/combat/attackTarget";
import { CombatCollisionResolver } from "../../domain/player/combat/combatCollisionResolver";
import { SimpleRepository } from "../../domain/repository";
import { CollisionDetector } from "./collisionDetector";

export class PhaserCombatCollisionResolver implements CombatCollisionResolver {
  private meleeCollisionDetector: CollisionDetector;
  public readonly onMeleeTarget: Observable<AttackTarget>;
  constructor(
    x: number,
    y: number,
    private scene: Scene,
    private attackTargetRepository: SimpleRepository<AttackTarget>
  ) {
    const meleeBody = this.scene.matter.bodies.rectangle(x, y, 30, 10);


    this.meleeCollisionDetector = new CollisionDetector(scene, meleeBody);

    this.meleeCollisionDetector.disable();
    this.onMeleeTarget = this.meleeCollisionDetector.onCollideStart.pipe(
      map((body) => this.attackTargetRepository.get(body.id.toString())),
      filter((target) => target !== undefined)
    ) as Observable<AttackTarget>;
    this.meleeCollisionDetector.onCollideStart.subscribe(console.log);
  }
  disableMeleeCollision() {
    this.meleeCollisionDetector.disable();
  }
  enableMeleeCollision() {
    this.meleeCollisionDetector.enable();
  }
}
