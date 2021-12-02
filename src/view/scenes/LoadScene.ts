import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";
import {Loader} from "phaser"


export class LoadScene extends Phaser.Scene {
  private readonly originUrl: string
  constructor(originUrl: string) {
    super({ key: "loadScene" });
    this.originUrl = originUrl
  }
  
  preload() {
    AssetsConfiguration.spines.forEach(s => {
      this.load.spine(s.key, s.jsonPath, s.atlasPath)
    })
    AssetsConfiguration.spritesheets.forEach(ss => {
      this.load.spritesheet({...ss, url: `${this.originUrl}/${ss.path}`});
    })
    AssetsConfiguration.images.forEach(image => {
      this.load.image({...image, url: `${this.originUrl}/${image.path}`});
    } )
    this.load.on("complete", () => this.scene.start("gameScene"));
  }
}
