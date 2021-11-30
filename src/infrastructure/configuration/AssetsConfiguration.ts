interface Asset {
  path: string;
}

type SpriteSheet = Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig & Asset;
type ImageAsset = Phaser.Types.Loader.FileTypes.ImageFileConfig & Asset;

export const AssetsConfiguration: {
  spritesheets: SpriteSheet[];
  images: ImageAsset[];
} = {
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
