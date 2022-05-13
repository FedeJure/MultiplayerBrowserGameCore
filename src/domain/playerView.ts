import { BodyType } from "matter";
import { GameObjects, Scene } from "phaser";
import { Observable } from "rxjs";
import { AnimationCode, AnimationLayer } from "./animations/animations";
import { EntityView } from "./entity/entityView";
import { AnimationDto } from "./player/animations/AnimationDto";
import { CombatCollisionResolver } from "./player/combat/combatCollisionResolver";
import { Vector } from "./vector";

export interface PlayerView extends EntityView {
  body: {
    position: Vector;
    velocity: Vector;
  };
  playAnimation(
    anim: AnimationCode,
    layer: AnimationLayer,
    loop?: boolean,
    duration?: number
  ): void;
  playAnimations(anims: AnimationDto[])
  startFollowWithCam(): void;
  scene: Scene;
  destroy(): void;
  add(children: GameObjects.GameObject): this;
  get onGroundCollideChange(): Observable<boolean>;
  setDisplayName(name: string);
  combatCollisionResolver: CombatCollisionResolver;
  setLifePercent(percent: number);
}
