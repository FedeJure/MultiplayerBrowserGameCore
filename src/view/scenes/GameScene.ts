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
    // solid.setCollisionByProperty({ collides: true }, true, true);

    const colliders = map.createFromObjects("colliders", {});

    colliders.forEach((col) => {
      // let asSprite = col as Phaser.Physics.Matter.Image;

      // console.log(this.matter.add.fromJSON(asSprite.x,asSprite.y,col.toJSON()))
      // asSprite.setExistingBody(this.matter.add.fromJSON(asSprite.x,asSprite.y,col.toJSON()))
      const asImage = col as Phaser.GameObjects.Polygon;
      console.log(asImage)
      const width = asImage.scaleX * 32;
      const height = asImage.scaleY * 32;
      const vertices = [
        {x: 0, y: 0},
        {x: 0, y: height},
        {x:width, y: height},
        {x: width, y: 0},
      ]
      const sp = Phaser.Physics.Matter.MatterGameObject(
        this.matter.world,
        col,
        {
          position: { x: asImage.x, y: asImage.y +height },
          isStatic: true,
          vertices: vertices,
          friction: 0,
          angle: asImage.rotation,
          restitution: 0,
        }
      ) as Phaser.Physics.Matter.Image;
      asImage.setAlpha(0)
      sp.setFriction(0)
      sp.setFrictionAir(0)


      // this.matter.add.sprite(asSprite.x, asSprite.y, "",undefined).setBody(asSprite.body)

      // const bounds = asSprite.getBounds();
      // const collider = new Physics.Matter.Sprite(
      //   this.matter.world,
      //   bounds.centerX,
      //   bounds.centerY + bounds.height,
      //   "",
      //   undefined,
      //   { isStatic: true }
      // );
      // collider.setScale(bounds.width / 32, bounds.height / 32);
      // collider.setFriction(0);
      // collider.setAlpha(0);
      // collider.setRotation(asSprite.rotation)

      // collider.setCollisionCategory(CollisionCategory.StaticEnvironment);
      // collider.setCollidesWith([CollisionCategory.Player]);
      sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
      sp.setCollidesWith([CollisionCategory.Player]);
      // asSprite.destroy()
    });
  };
}
