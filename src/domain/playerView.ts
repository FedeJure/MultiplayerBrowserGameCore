import { BodyType } from "matter";
import { GameObjects, Scene } from "phaser";
import { Observable } from "rxjs";
import { AnimationCode, AnimationLayer } from "./animations/animations";
import { AnimationDto } from "./player/animations/AnimationDto";
import { CombatCollisionResolver } from "./player/combat/combatCollisionResolver";
import { Vector } from "./vector";

export interface PlayerView {
  body: {
    position: Vector;
    velocity: Vector;
  };
  height: number;
  width: number;
  getBounds(): { x: number; y: number; width: number; height: number };
  setVelocity(x: number, y: number): void;
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  setAngle(degreeAngle: number): void;
  lookToLeft(value: boolean): void;
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
  get matterBody(): BodyType;
  get velocity(): Vector;
  get positionVector(): Vector;
  add(children: GameObjects.GameObject): this;
  get onGroundCollideChange(): Observable<boolean>;
  get active(): boolean;
  get x(): number;
  get y(): number;
  setDisplayName(name: string);
  combatCollisionResolver: CombatCollisionResolver;
  setLifePercent(percent: number);
}
