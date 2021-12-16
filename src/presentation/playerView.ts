import { Scene } from "phaser";
import { Observable } from "rxjs";

export interface IPlayerView {
  body: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
  };
  setVelocity(x: number, y: number): void;
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  lookToLeft(value: boolean): void;
  playAnimation(anim: string): void;
  startFollowWithCam(): void;
  moveTo(x: number, y: number, time: number): void;
  scene: Scene;
  destroy(): void;
  get onUpdate(): Observable<{ time: number; delta: number }>;
  get onPreUpdate(): Observable<{ time: number; delta: number }>;
  get matterBody(): Phaser.Physics.Arcade.Body;
  get velocity(): Phaser.Math.Vector2;
  get position(): Phaser.Math.Vector2;
}
