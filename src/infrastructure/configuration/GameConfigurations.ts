export interface GameConfigurations {
  initialMapId: number;
  initialPosition: { x: number; y: number };
}

export const DefaultGameConfiguration: GameConfigurations = {
  initialMapId: 0,
  initialPosition: { x: 1000, y: 2000 },
};
