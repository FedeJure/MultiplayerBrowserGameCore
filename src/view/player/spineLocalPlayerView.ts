import { Scene } from "phaser";
import { Exit } from "../../domain/environment/exit";
import { Ladder } from "../../domain/environment/ladder";
import { LocalPlayerView } from "../../domain/player/localPlayerView";
import { EntityIngameHud } from "../entity/entityIngameHud";
import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";
import { TransitionView } from "../ui/TransitionView";
import { IsInsidePropertyOrRemove } from "../utils";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";

export class SpineLocalPlayerView
  extends SpinePhaserEntityView
  implements LocalPlayerView
{
  private transitionView: TransitionView;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    texture: string = "hero",
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver,
  ) {
    super(scene, x, y, height, width, name, texture);
    this.hud = new EntityIngameHud(scene, 0, -height, height, 50, true);
    this.hud.setDisplayName(name);
    this.transitionView = new TransitionView(this.scene);
  }
  currentExit?: Exit | undefined;
  startTransporting() {
    this.transitionView.fadeOff(1000);
  }
  stopTransporting() {
    this.transitionView.fadeIn(1000);
    this.scene.cameras.main.centerOn(this.x, this.y)
  }

  die(): void {
    this.transitionView.fadeOff(1000);
    this.scene.time.delayedCall(1000, () => {
      this.transitionView.fadeIn(1000);
    });
  }

  get inLadder() {
    return IsInsidePropertyOrRemove<Ladder>(this, "ladder") !== undefined;
  }

  startFollowWithCam(cam: Phaser.Cameras.Scene2D.Camera): void {
    cam.startFollow(this, false, 0.1, 0.1);
  }
}
