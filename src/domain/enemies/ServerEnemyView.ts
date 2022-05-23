import { Observable } from "rxjs";
import { Vector } from "../vector";
import { EnemyView } from "./EnemyView";

export interface ServerEnemyView extends EnemyView {
  onPlatformDetectorEnter: Observable<Vector>;
  onPlatformDetectorLeave: Observable<Vector>;
}
