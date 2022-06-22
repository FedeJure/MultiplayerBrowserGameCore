export enum ViewObjectType {
  Entity = "entity",
  PlatformDetector = "platformDetector",
  Loot = 'loot'
}
export interface ViewObject {
  id: string;
  viewType: ViewObjectType;
}
