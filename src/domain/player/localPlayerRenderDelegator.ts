import { Scene } from "phaser";
import { BackgroundScene } from "../../view/scenes/BackgroundScene";
import { SceneNames } from "../../view/scenes/SceneNames";
import { Delegator } from "../delegator";
import { ControllablePlayer } from "./players/controllablePlayer";

export class LocalPlayerRenderDelegator implements Delegator {
  private readonly maxZoom = 3.5;
  private readonly minZoom = 1;
  private readonly startZoom = 1.6;

  private zoom = this.startZoom;
  private zooms: { [key: string]: number } = {};
  constructor(private player: ControllablePlayer) {
    this.player = player;
  }
  init(): void {
    const mainCamera = this.player.view.scene.cameras.main;
    const bgScene = this.player.view.scene.scene.get(
      SceneNames.BackgroundScene
    );
    const bgCamera = bgScene.cameras.main;
    this.initWithCamera(this.player.view.scene, mainCamera, 1, 3.5);
    this.initWithCamera(bgScene, bgCamera, 1, 1.1);
  }

  initWithCamera(
    scene: Scene,
    cam: Phaser.Cameras.Scene2D.Camera,
    minZoom: number,
    maxZoom: number
  ) {
    this.player.view.startFollowWithCam(cam);
    this.zooms[scene.scene.key] = minZoom + (maxZoom - minZoom) / 2;

    cam.setZoom(this.zooms[scene.scene.key]);
    cam.setOrigin(0.5, 0.5);
    cam.setDeadzone(50, 50);
    const step = (maxZoom - minZoom) / 20
    this.player.view.scene.input.on(
      "wheel",
      (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const toAdd = deltaY > 0 ? -step : step;
        this.zooms[scene.scene.key] = Math.min(
          maxZoom,
          Math.max(minZoom, this.zooms[scene.scene.key] + toAdd)
        );
        cam.setZoom(this.zooms[scene.scene.key]);
      }
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
