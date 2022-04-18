export interface EnvironmentObject {
  id: number;
  pivotOrigin: { x: number; y: number };
  height: number;
  width: number;
  textureName: string;
  atlasPath?: string;
  assetType: EnvironmentObjectAssetType
}

export enum EnvironmentObjectAssetType {
  spine = 'spine',
  spriteAtlas = 'spriteAtlas'
}
