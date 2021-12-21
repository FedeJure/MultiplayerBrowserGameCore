
export class LoadScene extends Phaser.Scene {
  constructor(protected originUrl: string) {
    super({
      key: "loadScene",
    });
  }

  preload() {
    // this.load.image(
    //   "ground",
    //   `${this.originUrl}/assets/level1/tiles/Ground.png`
    // );
    // this.load.image(
    //   "village",
    //   `${this.originUrl}/assets/level1/tiles/Village.png`
    // );
    // this.load.tilemapTiledJSON(
    //   "level1",
    //   `${this.originUrl}/assets/level1/level1.json`
    // );
    // this.load.once("complete", () => this.scene.launch("gameScene"));
    this.scene.launch("gameScene")
  }

  create() {
  }
}
