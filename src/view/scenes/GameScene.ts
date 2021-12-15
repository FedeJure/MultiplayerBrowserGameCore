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
    const village = map.addTilesetImage("village", "village");
    setTimeout(() => {
      map.createLayer("background", village);
      map.createLayer("background1", village);
    }, 10000)
    // map.createLayer("background", village);
    // map.createLayer("background1", village);
    map.createLayer("solid", tileset);
    const objLayer = map.getObjectLayer("colliders");
    objLayer.objects.forEach((obj) => {
      var sp: Phaser.Physics.Matter.Sprite | undefined;
      if (obj.rectangle) {
        const rec = new Phaser.GameObjects.Rectangle(
          this,
          obj.x || 0,
          obj.y || 0,
          obj.width,
          obj.height
        );
          
        sp = this.matter.add.gameObject(rec, {
          isStatic: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.angle += obj.rotation || 0;
        sp.setOrigin(0, 0);
      }

      if (obj.polygon) {
        const pol = new Phaser.GameObjects.Polygon(
          this,
          (obj.x || 0 ),
          (obj.y || 0),
          obj.polygon
        );
        pol.setPosition(pol.x + pol.displayOriginX, pol.y - pol.displayOriginY)
        sp = this.matter.add.gameObject(pol, {
          vertices: obj.polygon,
          isStatic: true,
          friction: 0,
          angle: pol.rotation,
          restitution: 0,
          frictionAir: 0,
          ignoreGravity: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setDisplayOrigin(0)
      }
      

      if (sp !== undefined) {
        sp.setBounce(0)
        sp.setFriction(0);
        sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
        sp.setCollidesWith([
          CollisionCategory.Player,
          CollisionCategory.StaticEnvironment,
        ]);
      }
    });
  };
}