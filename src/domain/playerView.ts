import { BodyType, Vector } from "matter";
import { GameObjects, Scene } from "phaser";
import { Observable } from "rxjs";

export interface IPlayerView {
  body: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
  };
  setVelocity(x: number, y: number): void;
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  setAngle(degreeAngle: number): void;
  lookToLeft(value: boolean): void;
  playAnimation(anim: string): void;
  startFollowWithCam(): void;
  moveTo(x: number, y: number, time: number): void;
  scene: Scene;
  destroy(): void;
  get matterBody(): BodyType;
  get velocity(): Vector;
  get position(): Vector;
  get gameObject(): Phaser.GameObjects.GameObject
  add(children: GameObjects.GameObject): this
  get onGroundCollideChange(): Observable<boolean>
}