import { Scene } from "phaser";
import { SocketServerConnection } from "../../infrastructure/socketServerConnection";

export class GameplayHud extends Scene {
  readonly connection: SocketServerConnection;

  pingText: Phaser.GameObjects.Text | undefined;
  fpsText: Phaser.GameObjects.Text | undefined;
  pointerText: Phaser.GameObjects.Text | undefined;

  constructor(connection: SocketServerConnection) {
    super({ key: "hud" });
    this.connection = connection;
  }

  create() {
    this.pointerText = this.add.text(10, 90, 'Move the mouse', { font: "12px Arial", color: "#ffffff" });
    this.pingText = new Phaser.GameObjects.Text(
      this,
      10,
      10,
      this.getPingText(0),
      { font: "12px Arial", color: "#ffffff" }
    );
    this.fpsText = new Phaser.GameObjects.Text(
      this,
      70,
      10,
      this.getFpsText(),
      { font: "12px Arial", color: "#ffffff" }
    );
    this.add.existing(this.pingText);
    this.add.existing(this.fpsText);
    this.connection.onPing.subscribe((ping) => {
      this.pingText?.setText(this.getPingText(ping));
    });
  }

  update() {
    this.fpsText?.setText(this.getFpsText());
    var pointer = this.input.activePointer;
    this.pointerText?.setText([
        'x: ' + pointer.x,
        'y: ' + pointer.y,
        'velocity x: ' + pointer.velocity.x,
        'velocity y: ' + pointer.velocity.y,
        'global X: ' + pointer.worldX,
        'global Y: ' + pointer.worldY
    ]);
  }

  getPingText(ping: number) {
    return `ms: ${ping}`;
  }

  getFpsText() {
    return `fps: ${Math.floor(this.game.loop.actualFps)}`;
  }
}
