import { Scene } from "phaser";
import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";
import { AssetLoader } from "../AssetLoader";
import { SceneNames } from "./SceneNames";

export class ClientLoadScene extends Scene {
  constructor() {
    super("");
  }

  preload(): void {
    AssetsConfiguration.spines.forEach((s) => {
      this.load.spine(
        s.key,
        AssetLoader.resolveAssetPath(s.jsonPath),
        AssetLoader.resolveAssetPath(s.atlasPath),
        undefined,
        { ...Phaser.Loader.XHRSettings(), async: true },
        { ...Phaser.Loader.XHRSettings(), async: true }
      );
    });
    AssetsConfiguration.spritesheets.forEach((ss) => {
      this.load.spritesheet(
        {
          ...ss,
          url: AssetLoader.resolveAssetPath(ss.path),
        },
        undefined,
        undefined,
        { ...Phaser.Loader.XHRSettings(), async: true }
      );
    });
    AssetsConfiguration.images.forEach((image) => {
      this.load.image(
        {
          ...image,
          url: AssetLoader.resolveAssetPath(image.path),
        },
        undefined,
        { ...Phaser.Loader.XHRSettings(), async: true }
      );
    });

    let joistickPlugin = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', joistickPlugin, true);
    this.load.once("complete", () => this.scene.launch(SceneNames.MainScene));
  }
}
