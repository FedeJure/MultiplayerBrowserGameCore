import { EntityAnimationCode, AnimationLayer } from "./animations";

export interface AnimationDto {
  name: string;
  layer: AnimationLayer;
  duration?: number;
  loop?: boolean;
  time?: number;
}

export const EmptyAnimations: AnimationDto[] = [
  { name: EntityAnimationCode.EMPTY_ANIMATION, layer: AnimationLayer.COMBAT },
  { name: EntityAnimationCode.EMPTY_ANIMATION, layer: AnimationLayer.MOVEMENT },
];
