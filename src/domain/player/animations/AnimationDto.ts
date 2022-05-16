import { AnimationCode, AnimationLayer } from "../../animations/animations";

export interface AnimationDto {
  name: string;
  layer: AnimationLayer;
  duration?: number;
  loop?: boolean;
  time?: number;
}

export const EmptyAnimations: AnimationDto[] = [
  { name: AnimationCode.EMPTY_ANIMATION, layer: AnimationLayer.COMBAT },
  { name: AnimationCode.EMPTY_ANIMATION, layer: AnimationLayer.MOVEMENT },
];
