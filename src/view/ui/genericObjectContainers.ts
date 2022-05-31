import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../../domain/items/inventoryView";
import { Item } from "../../domain/items/item";
import { PlayerInput } from "../../domain/player/playerInput";
import { AssetLoader } from "../AssetLoader";
import { InventoryItemView } from "../clientInventoryItemView";
import { ItemDetailView } from "../itemDetailView";
import { SceneNames } from "../scenes/SceneNames";
import { loadAssetAsync } from "../utils";

export interface ContainerDto {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
}

export class GenericObjectContainers
  extends GameObjects.GameObject
  implements InventoryView
{
  private container: GameObjects.Container;
  private canChange: boolean = false;
  private extraSpace = 25;
  private itemContainers: InventoryItemView[] = [];
  private itemDetail: ItemDetailView;

  constructor(
    scene: Scene,
    private userInput: PlayerInput,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private containers: ContainerDto[],
    private config: {
      padding: number;
    } = {
      padding: 0,
    }
  ) {
    super(scene, "ClientInventoryView");
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
    this.container.setPosition(this.x, this.y);
  }

  initBackgrounds() {
    const background = this.scene.add
      .image(0, 0, "inventoryBackground")
      .setDisplaySize(
        this.width + this.config.padding * 2,
        this.height + this.config.padding * 2
      )
      .setOrigin(0, 0);
    this.container.add(background);

    this.containers.forEach(this.createCell.bind(this));
  }

  async saveItems(items: Item[]) {
    Promise.all(
      items.map((i) =>
        loadAssetAsync(this.scene, () => {
          if (this.scene.textures.exists(i.icon)) return false;
          this.scene.load.image(i.icon, AssetLoader.resolveAssetPath(i.icon));
          return true;
        })
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

  createCell({ x, y, width, height }: ContainerDto) {
    const inventoryItem = new InventoryItemView(
      this.scene,
      x + this.config.padding,
      y + this.config.padding,
      width,
      height
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
