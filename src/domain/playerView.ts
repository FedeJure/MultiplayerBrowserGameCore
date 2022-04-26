import { BodyType, Vector } from "matter";
import { GameObjects, Scene } from "phaser";
import { Observable } from "rxjs";
import { AnimationCode, AnimationLayer } from "./animations/animations";

export interface PlayerView {
  body: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
  };
  setVelocity(x: number, y: number): void;
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  setAngle(degreeAngle: number): void;
  lookToLeft(value: boolean): void;
  playAnimation(anim: AnimationCode, layer?: AnimationLayer, loop?: boolean): void;
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
}
