import { Delegator } from "../delegator";
import { ClientPlayer } from "./localPlayer";

export class LocalPlayerRenderDelegator implements Delegator {
  private readonly maxZoom = 1.6;
  private readonly minZoom = 0.6;
  private readonly startZoom = 1.6;

  private zoom = this.startZoom;
  constructor(private player: ClientPlayer) {
    this.player = player;
  }
  init(): void {
    this.player.view.startFollowWithCam();
    this.player.view.scene.cameras.main.setZoom(this.startZoom);
    this.player.view.scene.cameras.main.setOrigin(0.5, 0.8);
    this.player.view.scene.cameras.main.setDeadzone(100, 300)

    this.player.view.scene.input.on(
      "wheel",
      (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const toAdd = deltaY > 0 ? -0.1 : 0.1;
        this.zoom = Math.min(
          this.maxZoom,
          Math.max(this.minZoom, this.zoom + toAdd)
        );
        this.player.view.scene.cameras.main.setZoom(this.zoom);
      }
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
