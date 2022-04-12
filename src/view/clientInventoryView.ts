import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { Item } from "../domain/items/item";
import { PlayerInput } from "../domain/player/playerInput";
import { AssetLoader } from "./AssetLoader";
import { InventoryItemView } from "./clientInventoryItemView";
import { ItemDetailView } from "./itemDetailView";
import { SceneNames } from "./scenes/SceneNames";
import { loadAssetAsync } from "./utils";

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
  private itemDetail: ItemDetailView;

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
    this.scene.scale.addListener(Phaser.Scale.Events.RESIZE, () => {
      this.setupInventoryPosition();
    });
    this.itemDetail = new ItemDetailView(scene);
    this.itemDetail.setVisible(false);
    this.container.add(this.itemDetail);
  }

  setupInventoryPosition() {
    this.container.setPosition(
      this.scene.game.canvas.width - this.displayWidth * 1.25,
      this.scene.game.canvas.height / 2 - this.displayHeight / 2
    );
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

  async saveItems(items: Item[]) {
    Promise.all(
      items.map((i) =>
        loadAssetAsync(this.scene, () =>
          this.scene.load.image(i.icon, AssetLoader.resolveAssetPath(i.icon))
        )
      )
    ).then(() => {
      this.itemContainers.forEach((container) => {
        if (container.isEmpty && items.length > 0) {
          container.setItem(items.pop()!);
        }
      });
      if (items.length > 0) throw new Error("Inventory Full");
    });
    
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

    inventoryItem.onMouseOver.subscribe((item) => {
      this.itemDetail.setItem(item);
      this.itemDetail.setVisible(true);
      this.itemDetail.setPosition(inventoryItem.x, inventoryItem.y);
      this.container.bringToTop(this.itemDetail);
    });

    inventoryItem.onMouseExit.subscribe(() => {
      this.itemDetail.setVisible(false);
    });

    inventoryItem.onDragStart.subscribe(() => {
      this.itemDetail.setVisible(false);
      this.container.bringToTop(inventoryItem);
    });

    inventoryItem.onItemDrop.subscribe((item) => {
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
        try {
          nextItemContainer.setItem(item.item);
          inventoryItem.removeItem();
        } catch (error) {
          inventoryItem.resetItemState();
        }
      } else inventoryItem.resetItemState();
    });

    this.itemContainers.push(inventoryItem);
    this.container.add(inventoryItem);
  }
}
