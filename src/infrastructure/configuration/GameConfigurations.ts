import { Vector } from "../../domain/vector";

export interface GameConfigurations {
  initialMapId: number;
  initialPosition: Vector;
  gameRate: 30 | 60 | 120
  lootDuration: number // in milliseconds
  lootDistance: number
}

export const DefaultGameConfiguration: GameConfigurations = {
  initialMapId: 0,
  initialPosition: { x: 1000, y: 1450 },
  gameRate: 60,
  lootDuration: 60000,
  lootDistance: 40
};
