import { Scene } from "phaser";
import { ItemType } from "../domain/items/itemType";
import { PlayerInput } from "../domain/player/playerInput";
import { ContainerDto, CellContainerView } from "./ui/CellContainerView";

export class ClientBuildView extends CellContainerView {
  private dtos: ContainerDto[];
  private canChange: boolean;
  private userInput: PlayerInput;

  constructor(scene: Scene, userInput: PlayerInput) {
    const dtos: ContainerDto[] = [];
    const cellSize = 50;
    const columnCount = 5;
    const rowCount = 7;
    const width = columnCount * cellSize;
    const height = rowCount * cellSize;

    const firstY = height / 8;

    dtos.push(
      {
        id: 0,
        x: width / 2 - cellSize / 2,
        y: firstY,
        height: cellSize,
        width: cellSize,
        title: "Helmet",
        allowedTypes: [ItemType.HELMET_EQUIPMENT],
      },
      {
        id: 1,
        x: width / 2 - cellSize / 2,
        y: firstY + cellSize * 2,
        height: cellSize * 1.25,
        width: cellSize,
        title: "Armor",
        allowedTypes: [ItemType.ARMOR_EQUIPMENT],
      },
      {
        id: 2,
        x: width / 5 - cellSize / 2,
        y: firstY + cellSize * 2,
        height: cellSize,
        width: cellSize,
        title: "Hands",
        allowedTypes: [ItemType.GLOVES_EQUIPMENT],
      },
      {
        id: 3,
        x: width / 2 - cellSize / 2,
        y: firstY + cellSize * 4,
        height: cellSize,
        width: cellSize,
        title: "Boots",
        allowedTypes: [ItemType.BOOTS_EQUIPMENT],
      },
      {
        id: 4,
        x: width / 5 - cellSize / 2,
        y: firstY + cellSize * 4,
        height: cellSize,
        width: cellSize,
        title: "Primary Weapon",
        allowedTypes: [ItemType.PRIMARY_WEAPON],
      },
      {
        id: 4,
        x: width / 1.2 - cellSize / 2,
        y: firstY + cellSize * 4,
        height: cellSize,
        width: cellSize,
        title: "Secondary Weapon",
        allowedTypes: [ItemType.SECONDARY_WEAPON],
      }
    );

    super(
      scene,
      scene.game.canvas.width / 10,
      scene.game.canvas.height / 2 - height / 2,
      width,
      height,
      dtos,
      { padding: 10, title: "Build" }
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
}
