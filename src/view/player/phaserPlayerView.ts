import { Physics } from "phaser";
import { Observable } from "rxjs";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { PlayerView } from "../../domain/playerView";
import { CollisionDetector } from "./collisionDetector";
import { ExistentDepths } from "../existentDepths";
import {
  AnimationCode,
  AnimationLayer,
} from "../../domain/animations/animations";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import { AnimationDto } from "../../domain/player/animations/AnimationDto";
import { PhaserEntityView } from "../controllable/phaserEntityView";

export class PhaserPlayerView extends PhaserEntityView implements PlayerView {
  private readonly groundCollisionDetector: CollisionDetector;

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
    view.scene.matter.add.gameObject(this);
    this.selfAsPhysic.setBounce(0);

    this.groundCollisionDetector = new CollisionDetector(
      this.scene,
      this.scene.matter.bodies.rectangle(
        this.x,
        this.y + this.height / 2 + 1,
        this.width / 2,
        2
      )
    );
    this.setDepth(ExistentDepths.GROUND);

    this.initCollisions();
  }

  playAnimations(anims: AnimationDto[]) {}
  setLifePercent(percent: number) {}
  playAnimation(anim: AnimationCode, animLayer: AnimationLayer) {}
  setDisplayName(name: string) {}

  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this, false, 0.1, 0.1);
  }
  private initCollisions() {
    const body = this.scene.matter.body.create({
      parts: [this.matterBody, this.groundCollisionDetector.body],
    });
    this.selfAsPhysic.setExistingBody(body);
    this.scene.matter.setCollisionGroup(
      [this.matterBody],
      -CollisionCategory.Player
    );
    this.scene.matter.setCollisionCategory(
      [this.matterBody],
      CollisionCategory.Player
    );
    this.scene.matter.setCollidesWith(
      [this.matterBody],
      [
        CollisionCategory.StaticEnvironment,
        CollisionCategory.WorldBounds,
        CollisionCategory.DamageArea,
      ]
    );
  }

  public get onGroundCollideChange(): Observable<boolean> {
    return this.groundCollisionDetector.onCollideChange;
  }
}
