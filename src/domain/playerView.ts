import { BodyType } from "matter";
import { GameObjects, Scene } from "phaser";
import { Observable } from "rxjs";
import { EntityAnimationCode, AnimationLayer } from "./entity/animations";
import { EntityView } from "./entity/entityView";
import { AnimationDto } from "./entity/AnimationDto";
import { CombatCollisionResolver } from "./player/combat/combatCollisionResolver";
import { Vector } from "./vector";

export interface PlayerView extends EntityView {
  body: {
    position: Vector;
    velocity: Vector;
  };
  startFollowWithCam(): void;
  scene: Scene;
  destroy(): void;
  add(children: GameObjects.GameObject): this;
  get onGroundCollideChange(): Observable<boolean>;
  combatCollisionResolver: CombatCollisionResolver;
}
