import { Delegator } from "../delegator";
import { LocalPlayer } from "./localPlayer";

export class LocalPlayerRenderDelegator implements Delegator {
  private readonly player: LocalPlayer;
  private readonly maxZoom = 3;
  private readonly minZoom = 0.05;
  private readonly startZoom = 2;

  private zoom = this.startZoom;
  constructor(player: LocalPlayer) {
    this.player = player;
  }
  init(): void {
    this.player.view.startFollowWithCam();
    this.player.view.scene.cameras.main.setZoom(this.startZoom);
    this.player.view.setDisplayName(this.player.info.name)
    this.player.view.scene.input.on(
      "wheel",
      (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        this.player.view.scene.cameras.main.setZoom(2, 2);
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
