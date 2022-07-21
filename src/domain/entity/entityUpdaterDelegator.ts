import { Scene } from "phaser";
import { Delegator } from "../delegator";
import { Entity } from "./entity";

export class EntityStateUpdaterDelegator implements Delegator {
  private time: number = 0
  constructor(private entity: Entity, private scene: Scene) {}
  init(): void {
    this.scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, (delta) => {
      const deltaInMillis = delta * 1000
      this.time += deltaInMillis
      this.entity.physicsUpdate(this.time, deltaInMillis) 

    })
  }
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.entity.view.active) return;
    this.entity.update(time, delta);
  }
  postUpdate() {
    if (!this.entity.view.active) return;
    this.entity.postUpdate();
  }
}
