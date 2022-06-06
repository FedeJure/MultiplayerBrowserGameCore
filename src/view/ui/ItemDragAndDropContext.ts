import { CellContainerView } from "./CellContainerView";
import { DraggableContext } from "./DraggableContext";
import { ItemCellView } from "./ItemCellView";
import { ItemDetailView } from "./ItemDetailView";
import { Scene } from "phaser";

export class DragAndDropContext {
  private lastCellContainer: ItemCellView | null = null;

  private objectDetailPanel: ItemDetailView;

  constructor(
    private areas: CellContainerView[],
    private draggableContext: DraggableContext,
    scene: Scene
  ) {
    this.objectDetailPanel = new ItemDetailView(scene);
    this.objectDetailPanel.setVisible(false);
    draggableContext.OnDrag.subscribe(({ object }) => {
      if (object.container) {
        this.lastCellContainer = object.container;
        object.container.removeObjectTemporally();
      }
      this.objectDetailPanel.setVisible(false);
    });

    draggableContext.OnObjectDrop.subscribe(({ object }) => {
      const vec = new Phaser.Math.Vector2(
        object.getBounds().centerX,
        object.getBounds().centerY
      );

      let nextCell: ItemCellView | undefined;

      for (let i = 0; i < areas.length; i++) {
        nextCell = areas[i].getCellInGlobalPosition(
          vec.x,
          vec.y,
          object.item.types
        );
        if (nextCell) break;
      }
      if (nextCell) {
        this.lastCellContainer?.removeObject();
        nextCell.setExistingObject(object);
      } else {
        if (!object.container)
          this.lastCellContainer?.setExistingObject(object);
      }
      this.lastCellContainer = null;
    });
  }
}
