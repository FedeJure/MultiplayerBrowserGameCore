import { Observable, Subject } from "rxjs";
import { Scene, Physics, GameObjects } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { SceneNames } from "./SceneNames";

export class GameScene extends Scene {
  private _onUpdate = new Subject<{ time: number; delta: number }>();
  private _onCreate = new Subject<void>();

  private _lifeCycleObjects: GameObjects.Group | undefined;
  private frameTime: number = 0
  private delay = 1000/DefaultGameConfiguration.gameRate

  constructor(protected collisionDispatcher: CollisionsDispatcher) {
    super({
      key: SceneNames.MainScene,
    });
    this.collisionDispatcher = collisionDispatcher;
  }

  create() {
    this._lifeCycleObjects = this.add.group({ runChildUpdate: true });

    this.initCollisions();
    this._onCreate.next();
  }

  initCollisions() {
    this.matter.world.addListener(
      "collisionactive",
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

    this.frameTime += delta

    if (this.frameTime > this.delay) {  
        this.frameTime = 0;
        this._onUpdate.next({ time, delta });
    }

    
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
}
