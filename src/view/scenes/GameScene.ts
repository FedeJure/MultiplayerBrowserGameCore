import { Observable, Subject } from "rxjs";
import Phaser, { Scene, Physics, GameObjects } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";

export class GameScene extends Scene {
  private _onUpdate = new Subject<{ time: number; delta: number }>();
  private _onCreate = new Subject<void>();

  private _lifeCycleObjects: GameObjects.Group | undefined;

  constructor(protected collisionDispatcher: CollisionsDispatcher) {
    super({
      key: "gameScene",
    });
    this.collisionDispatcher = collisionDispatcher;
  }

  create() {
    this._lifeCycleObjects = this.add.group({ runChildUpdate: true });
    this.initPlatforms();

    this.initCollisions();
    this._onCreate.next();
  }

  initCollisions() {
    this.matter.world.addListener(
      "collisionstart",
      (ev: Physics.Matter.Events.CollisionStartEvent) => {
        this.collisionDispatcher.sendCollisionStart(ev);
      },
      this
    );

    this.matter.world.addListener(
      "collisionend",
      (ev: Physics.Matter.Events.CollisionEndEvent) => {
        this.collisionDispatcher.sendCollisionEnd(ev);
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
    const map = this.make.tilemap({
      key: "level1",
    });
    const tileset = map.addTilesetImage("ground", "ground");
    map.createLayer("background", tileset);
    const solid = map.createLayer("solid", tileset);
    const colliders = map.createFromObjects("colliders", {});
    colliders.forEach((col) => {
      const asSprite = col as Phaser.Physics.Matter.Sprite;
      // this.matter.add.gameObject(col, {
      //   isStatic: true,
      // });
      const bounds = asSprite.getBounds();
      const collider = new Physics.Matter.Sprite(
        this.matter.world,
        bounds.centerX,
        bounds.centerY + bounds.height,
        "",
        undefined,
        { isStatic: true }
      );
      collider.setScale(bounds.width / 32, bounds.height / 32);
      collider.setFriction(0);
      collider.setAlpha(0);
      console.log(collider);

      collider.setCollisionCategory(CollisionCategory.StaticEnvironment);
      collider.setCollidesWith([CollisionCategory.Player]);
      asSprite.destroy()
      // const ground = new Physics.Matter.Sprite(this.matter.world,asSprite.x, asSprite.y, "");
      // ground.setScale(asSprite.width, 1)
      // ground.setStatic(true);
      // ground.setFriction(0);
      // ground.setCollisionCategory(CollisionCategory.StaticEnvironment);
      // ground.setCollidesWith([CollisionCategory.Player]);
    });
  };
}
