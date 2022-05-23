import { Observable } from "rxjs";
import { EntityView } from "../entity/entityView";
import { Vector } from "../vector";

export interface EnemyView extends EntityView {
    onPlatformDetectorFound: Observable<Vector>
}
