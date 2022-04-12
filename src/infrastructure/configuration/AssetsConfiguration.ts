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
    {
      key: "testItemIcon",
      path: "ui/testItem.png",
    },
    {
      key: "testItemIcon1",
      path: "ui/testItem.png",
    },
  ],
};
