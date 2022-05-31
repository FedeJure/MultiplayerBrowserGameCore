import { Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { Item } from "../domain/items/item";
import { PlayerInput } from "../domain/player/playerInput";
import { AssetLoader } from "./AssetLoader";
import {
  ContainerDto,
  CellContainerView,
} from "./ui/CellContainerView";
import { loadAssetAsync } from "./utils";

export class ClientInventoryView extends CellContainerView implements InventoryView {
  private dtos: ContainerDto[];
  constructor(scene: Scene, input: PlayerInput) {
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
        });
      }
    }
    super(
      scene,
      input,
      scene.game.canvas.width - width * 1.25,
      scene.game.canvas.height / 2 - height / 2,
      width,
      height,
      dtos,
      { padding: 10 }
    );
    this.dtos = dtos;
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
