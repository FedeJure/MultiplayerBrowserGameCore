import { EnvironmentObjectVariant } from "./environmentObjectVariant";

export interface EnvironmentObject {
  id: number;
  pivotOrigin: { x: number; y: number };
  height: number;
  width: number;
  textureName: string;
  atlasPath?: string;
  assetType: EnvironmentObjectAssetType
  objectVariant: EnvironmentObjectVariant
}

export enum EnvironmentObjectAssetType {
  spine = 'spine',
  tiledTile = 'tiledTile'
}