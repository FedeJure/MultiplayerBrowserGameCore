import { Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { Item } from "../domain/items/item";
import { ItemType } from "../domain/items/itemType";
import { PlayerInput } from "../domain/player/playerInput";
import { AssetLoader } from "./AssetLoader";
import { ContainerDto, CellContainerView } from "./ui/CellContainerView";
import { DraggableContext } from "./ui/DraggableContext";
import { loadAssetAsync } from "./utils";

export class ClientInventoryView
  extends CellContainerView
  implements InventoryView
{
  private dtos: ContainerDto[];
  private canChange: boolean;
  private userInput: PlayerInput;

  constructor(
    scene: Scene,
    userInput: PlayerInput,
    draggableContext: DraggableContext
  ) {
    const dtos: ContainerDto[] = [];
    const cellSize = 50;
    const columnCount = 5;
    const rowCount = 7;
    const width = columnCount * cellSize;
    const height = rowCount * cellSize;
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
    super(
      scene,
      draggableContext,
      scene.game.canvas.width - width * 1.25,
      scene.game.canvas.height / 2 - height / 2,
      width,
      height,
      dtos,
      { padding: 10, title: "Inventory" }
    );
    this.dtos = dtos;
    this.userInput = userInput;
    this.canChange = false;
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
          this.addObject(dto.id, item);
        } catch (error) {}
      });
    });
  }
}
