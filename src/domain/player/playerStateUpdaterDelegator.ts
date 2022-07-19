import { Scene } from "phaser";
import { Delegator } from "../delegator";
import { Player } from "./players/player";

export class PlayerStateUpdaterDelegator implements Delegator {
  private time: number = 0
  constructor(private player: Player, private scene: Scene) {}
  init(): void {
    this.scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, (delta) => {
      const deltaInMillis = delta * 1000
      this.time += deltaInMillis
      this.player.physicsUpdate(this.time, deltaInMillis) 

    })
  }
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    this.player.update(time, delta);
  }
  postUpdate() {
    if (!this.player.view.active) return;
    this.player.postUpdate();
  }
}
