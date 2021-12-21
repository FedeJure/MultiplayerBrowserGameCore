export interface GameConfigurations {
  initialMapId: number;
  initialPosition: { x: number; y: number };
  getMapRootPath: (id: number, layerId: number) => string;
}

export const DefaultGameConfiguration: GameConfigurations = {
  initialMapId: 0,
  initialPosition: { x: 1000, y: 1200 },
  getMapRootPath: (id: number) => `/assets/map-${id}/`,
};
