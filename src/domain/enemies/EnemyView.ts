import { EntityView } from "../entity/entityView";
import { AnimationDto } from "../player/animations/AnimationDto";

export interface EnemyView extends EntityView {
  playAnimations(anims: AnimationDto[]);
}
