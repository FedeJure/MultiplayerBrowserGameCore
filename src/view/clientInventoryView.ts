import { Scene } from "phaser";
import { PlayerInput } from "../domain/player/playerInput";
import { ContainerDto, GenericObjectContainers } from "./ui/genericObjectContainers";

export class ClientInventoryView extends GenericObjectContainers {
  constructor(scene: Scene, input: PlayerInput) {
    const dtos: ContainerDto[] = []
    const cellSize = 50
    const columnCount = 5
    const rowCount = 7
    const width = columnCount * cellSize
    const height = rowCount * cellSize
    for (let h = 0; h < 5; h++) {
      for (let w = 0; w < 7; w++) {
        dtos.push({
          id: Math.random(),
          x: h * cellSize,
          y: w * cellSize,
          width: cellSize,
          height: cellSize
        })
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
      {padding: 10}
    )
  }
}
