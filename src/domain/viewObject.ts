export enum ViewObjectType {
  Entity = "entity",
  PlatformDetector = "platformDetector",
}
export interface ViewObject {
  id: string;
  viewType: ViewObjectType;
}
