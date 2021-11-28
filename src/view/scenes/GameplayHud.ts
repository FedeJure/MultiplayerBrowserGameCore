import { Scene } from "phaser";
import { SocketServerConnection } from "../../infrastructure/socketServerConnection";

export class GameplayHud extends Scene {
  readonly connection: SocketServerConnection;

  pingText: Phaser.GameObjects.Text | undefined;
  fpsText: Phaser.GameObjects.Text | undefined;

  constructor(connection: SocketServerConnection) {
    super({ key: "hud" });
    this.connection = connection;
  }

  create() {
    this.pingText = new Phaser.GameObjects.Text(
      this,
      10,
      10,
      this.getPingText(0),
      { font: "12px Arial", color: "#000000" }
    );
    this.fpsText = new Phaser.GameObjects.Text(
      this,
      70,
      10,
      this.getFpsText(),
      { font: "12px Arial", color: "#000000" }
    );
    this.add.existing(this.pingText);
    this.add.existing(this.fpsText);
    this.connection.onPing.subscribe((ping) => {
      this.pingText?.setText(this.getPingText(ping));
    });
  }

  update() {
    this.fpsText?.setText(this.getFpsText());
  }

  getPingText(ping: number) {
    return `ms: ${ping}`;
  }

  getFpsText() {
    return `fps: ${Math.floor(this.game.loop.actualFps)}`;
  }
}
