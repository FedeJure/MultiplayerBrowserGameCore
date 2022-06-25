import { GameObjects, Scene } from "phaser";
import { EntityView } from "./entity/entityView";
import { Exit } from "./environment/exit";
import { CombatCollisionResolver } from "./player/combat/combatCollisionResolver";

export interface PlayerView extends EntityView {
  startFollowWithCam(cam: Phaser.Cameras.Scene2D.Camera): void;
  scene: Scene;
  destroy(): void;
  add(children: GameObjects.GameObject): this;
  combatCollisionResolver: CombatCollisionResolver;
  inLadder: boolean;
  currentExit?: Exit
}
