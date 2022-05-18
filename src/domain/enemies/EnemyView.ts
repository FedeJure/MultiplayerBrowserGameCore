import { EntityView } from "../entity/entityView";
import { AnimationDto } from "../entity/AnimationDto";

export interface EnemyView extends EntityView {
  playAnimations(anims: AnimationDto[]);
}
