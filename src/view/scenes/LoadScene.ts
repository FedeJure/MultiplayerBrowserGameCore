export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: "loadScene" });
  }

  preload() {
    this.load.spritesheet("player_anim", "./assets/player_anims.png", {
      frameWidth: 50,
      frameHeight: 37,
    });
    // this.load.image("player", "./assets/player.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("ground", "./assets/simple_platform.png");
    this.load.on("complete", () => this.scene.start("gameScene"));
  }
}
