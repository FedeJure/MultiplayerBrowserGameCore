import { tsExpressionWithTypeArguments } from "@babel/types";
import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { PlayerInput } from "../domain/player/playerInput";
import { InventoryItemView } from "./clientInventoryItemView";
import { SceneNames } from "./scenes/SceneNames";

export class ClientInventoryView
  extends GameObjects.GameObject
  implements InventoryView
{
  private container: GameObjects.Container;
  private canChange: boolean = false;
  private extraSpace = 25
  private width: number = 5;
  private height: number = 7;

  private get displayWidth() {
      return this.width * InventoryItemView.SIZE + this.extraSpace
  }

  private get displayHeight() {
    return this.height * InventoryItemView.SIZE + this.extraSpace * 2
}

  constructor(scene: Scene, private userInput: PlayerInput) {
    super(scene.scene.get(SceneNames.ClientHudScene), "ClientInventoryView");
    this.container = this.scene.add.container(0,0);
    this.container.setVisible(false);
    this.scene.add.group(this, { runChildUpdate: true });
    this.initBackgrounds();
    this.setupInventoryPosition()
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, () => {
        this.setupInventoryPosition()
    })
    
  }

  setupInventoryPosition() {
    this.container.setPosition(this.scene.game.canvas.width - this.displayWidth * 1.25, this.scene.game.canvas.height / 2 - this.displayHeight / 2)
  }

  initBackgrounds() {

    const background = this.scene.add
      .image(0, 0, "inventoryBackground")
      .setDisplaySize(
        this.displayWidth,
        this.displayHeight
      ).setOrigin(0,0);
    this.container.add(background);

    for (let w = 0; w < this.width; w++) {
      for (let h = 0; h < this.height; h++) {
        const item = new InventoryItemView(
          this.scene,
          w * InventoryItemView.SIZE + this.extraSpace / 2,
          h * InventoryItemView.SIZE + this.extraSpace / 2
        );
        this.container.add(item);
      }
    }
  }

  update(): void {
    if (this.canChange && this.userInput.inventory && !this.container.visible) {
      this.container.setVisible(true);
      this.canChange = false;
      return;
    }
    if (this.canChange && this.userInput.inventory && this.container.visible) {
      this.container.setVisible(false);
      this.canChange = false;
      return;
    }
    if (!this.userInput.inventory && !this.canChange) this.canChange = true;
  }
}
