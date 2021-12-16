export interface ProcessedMap {
  layerId: number;
  id: number;
  originX: number;
  originY: number;
  height: number;
  width: number;
  leftMapId: number | undefined;
  rightMapId: number | undefined;
  topMapId: number | undefined;
  bottomMapId: number | undefined;
  leftTopMapId: number | undefined;
  rightTopMapId: number | undefined;
  leftBottomMapId: number | undefined;
  rightBottomMapId: number | undefined;
}
