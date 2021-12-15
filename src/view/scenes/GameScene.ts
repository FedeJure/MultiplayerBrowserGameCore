import { Observable, Subject } from "rxjs";
import Phaser, { Scene, Physics, GameObjects } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { BodyType } from "matter";
class Test extends Phaser.GameObjects.Polygon {}
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
    map.createLayer("solid", tileset);
    const objLayer = map.getObjectLayer("colliders");
    // solid.setCollisionByProperty({ collides: true }, true, true);
    const pointsByName: { [key: string]: Phaser.Types.Tilemaps.TiledObject[] } =
      {};

    objLayer.objects
      .filter((o) => o.point)
      .forEach((o) => {
        if (!pointsByName[o.name]) pointsByName[o.name] = [];
        pointsByName[o.name].push(o);
      });

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



// Object.keys(pointsByName).forEach((k) => {
//   const points = pointsByName[k].flatMap((p) => [p.x, p.y]) as number[];
//   pointsByName[k].forEach((p) => {
//     this.add.text(p.x || 0, p.y || 0, `(${p.x}, ${p.y})`);
//   });
//   const path = this.add.line(points[0], points[1], ...points);
//   // this.matter.add.fromVertices(0,0, points)
//   // const pol1 = this.add.polygon(undefined, undefined, points);
//   // this.matter.add.fromVertices(0,0, points, {isStatic: true})
//   const sp = this.matter.add.gameObject(path, {
//     isStatic: true,
//     vertices: pointsByName[k],
//     chamfer: { radius: 5 },
//   }) as Phaser.Physics.Matter.Sprite;

//   // const pol = this.matter.add.polygon(points[0], points[1], points.length / 2, 1, {
//   //   vertices: pointsByName[k],
//   //   isStatic: true,
//   // });
//   const body = sp.body as BodyType;
//   sp.setPosition(sp.x - body.centerOffset.x, sp.y - body.centerOffset.y);

//   sp.setFriction(0);
//   sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
//   sp.setCollidesWith([CollisionCategory.Player]);
//   // sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
// });