import { Observable, Subject } from "rxjs";
import Phaser, { Scene, Physics, GameObjects, Types } from "phaser";
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
    // this.matter.world.addListener(
    //   "collisionstart",
    //   (ev: Physics.Matter.Events.CollisionStartEvent) => {
    //     this.collisionDispatcher.sendCollisionStart(ev);
    //   },
    //   this
    // );

    // this.matter.world.addListener(
    //   "collisionend",
    //   (ev: Physics.Matter.Events.CollisionEndEvent) => {
    //     this.collisionDispatcher.sendCollisionEnd(ev);
    //   },
    //   this
    // );
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
    map.createLayer("background", village);
    map.createLayer("background1", village);
    map.createLayer("solid", tileset);
    const objLayer = map.getObjectLayer("colliders");
    objLayer.objects.forEach((obj) => {
      var sp: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Polygon | undefined;
      if (obj.rectangle) {
        const rec = new Phaser.GameObjects.Rectangle(
          this,
          obj.x || 0,
          obj.y || 0,
          obj.width,
          obj.height
        );
          
        sp = this.physics.add.existing(rec, true) ;
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
        sp = this.physics.add.existing(pol, true);
        sp.setDisplayOrigin(0)
      }
    });
  };
}