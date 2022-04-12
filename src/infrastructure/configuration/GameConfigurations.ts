export interface GameConfigurations {
  initialMapId: number;
  initialPosition: { x: number; y: number };
  gameRate: 30 | 60 | 120
}

export const DefaultGameConfiguration: GameConfigurations = {
  initialMapId: 0,
  initialPosition: { x: 1000, y: 1450 },
  gameRate: 60,
  
};
