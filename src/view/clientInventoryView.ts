import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../domain/inventory/inventoryView";
import { Money } from "../domain/inventory/Money";
import { Item } from "../domain/items/item";
import { ItemType } from "../domain/items/itemType";
import { PlayerInput } from "../domain/player/playerInput";
import { AssetLoader } from "./AssetLoader";
import { ContainerDto, CellContainerView } from "./ui/CellContainerView";
import { MoneyDisplay } from "./ui/MoneyDisplay";
import { loadAssetAsync } from "./utils";

export class ClientInventoryView
  extends GameObjects.Container
  implements InventoryView
{
  private dtos: ContainerDto[];
  private canChange: boolean;
  private userInput: PlayerInput;
  public readonly itemInventory: CellContainerView;
  public readonly moneyView: MoneyDisplay;

  constructor(scene: Scene, userInput: PlayerInput) {
    const dtos: ContainerDto[] = [];
    const cellSize = 50;
    const columnCount = 5;
    const rowCount = 7;
    const width = columnCount * cellSize;
    const height = rowCount * cellSize;

    super(
      scene,
      scene.game.canvas.width - width * 1.25,
      scene.game.canvas.height / 2 - height / 2,
      []
    );
    for (let h = 0; h < 5; h++) {
      for (let w = 0; w < 7; w++) {
        dtos.push({
          id: Math.random(),
          x: h * cellSize,
          y: w * cellSize,
          width: cellSize,
          height: cellSize,
          allowedTypes: [
            ItemType.ARMOR_EQUIPMENT,
            ItemType.HELMET_EQUIPMENT,
            ItemType.GLOVES_EQUIPMENT,
            ItemType.BOOTS_EQUIPMENT,
            ItemType.PRIMARY_WEAPON,
            ItemType.SECONDARY_WEAPON,
            ItemType.CONSUMIBLE,
            ItemType.QUEST,
          ],
        });
      }
    }
    this.itemInventory = new CellContainerView(
      scene,
      this.x,
      this.y,
      width,
      height,
      dtos,
      { padding: 10, title: "Inventory" }
    );
    this.moneyView = new MoneyDisplay(scene, this.x, this.y + height)
    this.scene.add.group(this, { runChildUpdate: true });

    this.dtos = dtos;
    this.userInput = userInput;
    this.canChange = false;
  }

  update(): void {
    if (
      this.canChange &&
      this.userInput.inventory &&
      !this.itemInventory.visible
    ) {
      this.itemInventory.setVisible(true);
      this.moneyView.setVisible(true)
      this.canChange = false;
      return;
    }
    if (
      this.canChange &&
      this.userInput.inventory &&
      this.itemInventory.visible
    ) {
      this.itemInventory.setVisible(false);
      this.moneyView.setVisible(false)

      this.canChange = false;
      return;
    }
    if (!this.userInput.inventory && !this.canChange) this.canChange = true;
  }

  setMoney(money: Money) {}

  saveItems(items: Item[]) {
    Promise.all(
      items.map((i) =>
        loadAssetAsync(this.scene, () => {
          if (this.scene.textures.exists(i.icon)) return false;
          this.scene.load.image(i.icon, AssetLoader.resolveAssetPath(i.icon));
          return true;
        })
      )
    ).then(() => {
      this.dtos.forEach((dto) => {
        try {
          const item = items.shift();
          if (!item) return;
          this.itemInventory.addObject(dto.id, item);
        } catch (error) {}
      });
    });
  }
}
