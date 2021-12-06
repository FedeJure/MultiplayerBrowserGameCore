import { PlayerView } from "../../view/playerView";
import { Types } from "phaser";

interface Asset {
  path: string;
}

type SpriteSheet = Types.Loader.FileTypes.SpriteSheetFileConfig & Asset;
type ImageAsset = Types.Loader.FileTypes.ImageFileConfig & Asset;
interface SpineAsset {
  key: string;
  jsonPath: string;
  atlasPath: string;
}

export const AssetsConfiguration: {
  spritesheets: SpriteSheet[];
  images: ImageAsset[];
  spines: SpineAsset[];
} = {
  spines: [
    {
      key: "hero",
      jsonPath: "assets/spineboy.json",
      atlasPath: "assets/spineboy.atlas",
    },
  ],
  spritesheets: [
    {
      key: "player_anim",
      path: "assets/player_anims.png",
      frameConfig: {
        frameWidth: 50,
        frameHeight: 37,
      },
    },
  ],
  images: [
    {
      key: "background",
      path: "assets/background.png",
    },
    {
      key: "ground",
      path: "assets/simple_platform.png",
    },
  ],
};
