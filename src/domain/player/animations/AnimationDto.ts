import { AnimationCode, AnimationLayer } from "../../animations/animations";

export interface AnimationDto {
    name: AnimationCode,
    layer: AnimationLayer
    duration?: number,
    loop?: boolean
}