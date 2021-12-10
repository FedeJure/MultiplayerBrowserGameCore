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
      jsonPath: "assets/hero.json",
      atlasPath: "assets/hero.atlas",
    },
  ],
  spritesheets: [],
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
