import { Physics } from "phaser";
import { PlayerView } from "../../domain/playerView";
import {
  AnimationCode,
  AnimationLayer,
} from "../../domain/animations/animations";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import { AnimationDto } from "../../domain/player/animations/AnimationDto";
import { PhaserEntityView } from "../controllable/phaserEntityView";
import { Vector } from "matter";

export class PhaserPlayerView extends PhaserEntityView implements PlayerView {
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number,
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    super(view, x, y, height, width);
    this.setName("Player View");
  }

  playAnimations(anims: AnimationDto[]) {}
  setLifePercent(percent: number) {}
  playAnimation(anim: AnimationCode, animLayer: AnimationLayer) {}
  setDisplayName(name: string) {}

  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this, false, 0.1, 0.1);
  }
}
