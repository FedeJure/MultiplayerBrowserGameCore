import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { TestItem } from "../domain/items/item";
import { PlayerInput } from "../domain/player/playerInput";
import { InventoryItemView } from "./clientInventoryItemView";
import { SceneNames } from "./scenes/SceneNames";

export class ClientInventoryView
  extends GameObjects.GameObject
  implements InventoryView
{
  private container: GameObjects.Container;
  private canChange: boolean = false;
  private extraSpace = 25;
  private width: number = 5;
  private height: number = 7;
  private itemContainers: InventoryItemView[] = [];

  private get displayWidth() {
    return this.width * InventoryItemView.SIZE + this.extraSpace;
  }

  private get displayHeight() {
    return this.height * InventoryItemView.SIZE + this.extraSpace * 2;
  }

  constructor(scene: Scene, private userInput: PlayerInput) {
    super(scene.scene.get(SceneNames.ClientHudScene), "ClientInventoryView");
    this.container = this.scene.add.container(0, 0);
    this.container.setVisible(false);
    this.scene.add.group(this, { runChildUpdate: true });
    this.initBackgrounds();
    this.setupInventoryPosition();
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.setupInventoryPosition();
    });
    this.initTestItem();
  }

  setupInventoryPosition() {
    this.container.setPosition(
      this.scene.game.canvas.width - this.displayWidth * 1.25,
      this.scene.game.canvas.height / 2 - this.displayHeight / 2
    );
  }

  initTestItem() {
    this.itemContainers[2].setItem(TestItem);
    this.itemContainers[3].setItem(TestItem);
    this.itemContainers[4].setItem(TestItem);
  }

  initBackgrounds() {
    const background = this.scene.add
      .image(0, 0, "inventoryBackground")
      .setDisplaySize(this.displayWidth, this.displayHeight)
      .setOrigin(0, 0);
    this.container.add(background);

    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        this.createInventoryItem(w, h);
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

  createInventoryItem(x: number, y: number) {
    const inventoryItem = new InventoryItemView(
      this.scene,
      x * InventoryItemView.SIZE + this.extraSpace / 2,
      y * InventoryItemView.SIZE + this.extraSpace / 2
    );

    inventoryItem.onDragStart.subscribe(() => {
      this.container.bringToTop(inventoryItem);
    });

    inventoryItem.onItemDrop.subscribe((item) => {
      if (!inventoryItem.isEmpty) {
        inventoryItem.resetItemState();
        return;
      }
      const vec = new Phaser.Math.Vector2(
        item.gameObject.getBounds().centerX,
        item.gameObject.getBounds().centerY
      );

      const nextItemContainer = this.itemContainers.sort(
        (a, b) =>
          new Phaser.Math.Vector2(
            a.getBounds().centerX,
            a.getBounds().centerY
          ).distance(vec) -
          new Phaser.Math.Vector2(
            b.getBounds().centerX,
            b.getBounds().centerY
          ).distance(vec)
      )[0];
      if (nextItemContainer && nextItemContainer !== inventoryItem) {
        inventoryItem.removeItem();
        nextItemContainer.setItem(item.item);
      } else inventoryItem.resetItemState();
    });

    this.itemContainers.push(inventoryItem);
    this.container.add(inventoryItem);
  }
}
