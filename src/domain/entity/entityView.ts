import { AnimationDto } from "./AnimationDto";
import { Vector } from "../vector";
import { CollisionableEntity } from "./CollisionableEntity";

export interface EntityView {
  velocity: Vector;
  positionVector: Vector;
  x: number;
  y: number;
  active: boolean;
  height: number;
  width: number;
  getBounds(): { x: number; y: number; width: number; height: number };
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  setAngle(degreeAngle: number): void;
  lookToLeft(value: boolean): void;
  setVelocity(x: number, y: number): void;
  destroy()
  playAnimations(anims: AnimationDto[]): void
  setLifePercent(percent: number): void
  setDisplayName(name: string) : void
  getEntitiesClose(distance: number): CollisionableEntity[]
  setPositionInTime(x:number, y:number, time:number)
  grounded: boolean
  id: string
  blocked: boolean
}
