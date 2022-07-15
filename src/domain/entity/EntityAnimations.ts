import { EntityAnimationCode, AnimationLayer } from "./animations";
import { Entity } from "./entity";

export interface EntityAnimations {
  init(entity: Entity);
  update();
  stopAnimations()
  executeAnimation(
    anim: EntityAnimationCode,
    layer: AnimationLayer,
    loop?: boolean,
    duration?: number
  );
}
