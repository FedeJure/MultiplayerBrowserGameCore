import { PlayerView } from "../playerView";

export interface LocalPlayerView extends PlayerView {
  startTransporting();
  stopTransporting();
  startFollowWithCam(cam: Phaser.Cameras.Scene2D.Camera): void;
}
