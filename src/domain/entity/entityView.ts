import { BodyType } from "matter";
import { Vector } from "../vector";

export interface EntityView {
  velocity: Vector;
  positionVector: Vector;
  x: number;
  y: number;
  active: boolean;
  height: number;
  width: number;
  matterBody: BodyType
  getBounds(): { x: number; y: number; width: number; height: number };
  setPosition(x: number, y: number): void;
  setScale(x: number, y: number): void;
  setAngle(degreeAngle: number): void;
  lookToLeft(value: boolean): void;
  setVelocity(x: number, y: number): void;
}
