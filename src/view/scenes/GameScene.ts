import { Observable, Subject } from "rxjs";
import { Scene, Physics, GameObjects } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";

export class GameScene extends Scene {
  private _onUpdate = new Subject<{ time: number; delta: number }>();
  private _onCreate = new Subject<void>();

  private _lifeCycleObjects: GameObjects.Group | undefined;

  private _collisionDispatcher: CollisionsDispatcher;
  constructor(collisionDispatcher: CollisionsDispatcher) {
    super({ key: "gameScene" });
    this._collisionDispatcher = collisionDispatcher;
  }

  create() {
    this.scene.launch("hud");
    this._lifeCycleObjects = this.add.group({ runChildUpdate: true });
    this.initPlatforms();
    const background = this.add.image(1250, 300, "background");
    background.scaleY = 2;
    background.scaleX = 2;
    this.initCollisions();
    this._onCreate.next();
  }

  initCollisions() {
    this.matter.world.addListener(
      "collisionstart",
      (ev: Physics.Matter.Events.CollisionStartEvent) => {
        this._collisionDispatcher.sendCollisionStart(ev)
      },
      this
    );

    this.matter.world.addListener(
      "collisionend",
      (ev: Physics.Matter.Events.CollisionEndEvent) => {
        this._collisionDispatcher.sendCollisionEnd(ev)
      },
      this
    );
  }

  update(time: number, delta: number) {
    this._onUpdate.next({ time, delta });
  }

  addToLifecycle(object: GameObjects.GameObject) {
    this._lifeCycleObjects?.add(object);
  }

  removeFromLifecycle(object: GameObjects.GameObject) {
    this._lifeCycleObjects?.remove(object);
  }

  get onUpdate(): Observable<{ time: number; delta: number }> {
    return this._onUpdate;
  }

  get onCreate(): Observable<void> {
    return this._onCreate;
  }

  private initPlatforms = () => {
    //TODO: refactorear esto para generar platform de archivo de configs

    const ground = new Physics.Matter.Sprite(this.matter.world, 0, 500, "");
    ground.setScale(100, 1);
    ground.setStatic(true);
    ground.setFriction(0)
    ground.setCollisionCategory(CollisionCategory.StaticEnvironment);
    ground.setCollidesWith([CollisionCategory.Player]);
  };
}
