import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";

export class LoadScene extends Phaser.Scene {
  constructor(private originUrl: string) {
    super({
      key: "loadScene"
    });
  }

  preload() {
    AssetsConfiguration.spines.forEach((s) => {
      this.load.spine(
        s.key,
        `${this.originUrl}/${s.jsonPath}`,
        `${this.originUrl}/${s.atlasPath}`
      );
    });
    AssetsConfiguration.spritesheets.forEach((ss) => {
      this.load.spritesheet({ ...ss, url: `${this.originUrl}/${ss.path}` });
    });
    AssetsConfiguration.images.forEach((image) => {
      this.load.image({ ...image, url: `${this.originUrl}/${image.path}` });
    });
    this.load.on("complete", () => this.scene.start("gameScene"));
  }
}
