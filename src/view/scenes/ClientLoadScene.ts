import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";
import { LoadScene } from "./LoadScene";

export class ClientLoadScene extends LoadScene {
  constructor(originUrl: string) {
    super(originUrl);
  }

  preload(): void {
    super.preload();
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
    this.load.image(
      "ground",
      `${this.originUrl}/assets/level1/tiles/Ground.png`
    );
    this.load.tilemapTiledJSON(
      "level1",
      `${this.originUrl}/assets/level1/level1.json`
    );
  }
}
