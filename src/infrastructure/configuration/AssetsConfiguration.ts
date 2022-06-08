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
  assetsPath: string;
  spritesheets: SpriteSheet[];
  images: ImageAsset[];
  spines: SpineAsset[];
} = {
  assetsPath: '/assets/',
  spines: [
    {
      key: "hero",
      jsonPath: "hero.json",
      atlasPath: "hero.atlas",
    },
    {
      key: "slime",
      jsonPath: "spine/enemies/slime/slime.json",
      atlasPath: "spine/enemies/slime/slime.atlas",
    },
  ],
  spritesheets: [],
  images: [
    {
      key: "inventoryBackground",
      path: "ui/inventory_background.png",
    },
    {
      key: "inventoryItemBackground",
      path: "ui/inventory_item_background.png",
    },
  ],
};
