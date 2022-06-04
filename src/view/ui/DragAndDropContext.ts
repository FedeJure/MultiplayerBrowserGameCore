import { CellContainerView } from "./CellContainerView";
import { DraggableContext } from "./DraggableContext";
import { CellView } from "./CellView";
import { ObjectDetailView } from "./objectDetailView";
import { Scene } from "phaser";

export class DragAndDropContext {
  private lastCellContainer: CellView | null = null;

  private objectDetailPanel: ObjectDetailView;

  constructor(
    private areas: CellContainerView[],
    private draggableContext: DraggableContext,
    scene: Scene
  ) {
    this.objectDetailPanel = new ObjectDetailView(scene);
    this.objectDetailPanel.setVisible(false);
    draggableContext.OnDrag.subscribe(({ object }) => {
      if (object.container) {
        this.lastCellContainer = object.container;
        object.container.removeObject();
      }
      this.objectDetailPanel.setVisible(false);
    });

    draggableContext.OnObjectDrop.subscribe(({ object }) => {
      const vec = new Phaser.Math.Vector2(
        object.getBounds().centerX,
        object.getBounds().centerY
      );

      let nextCell: CellView | undefined

      for (let i = 0; i < areas.length; i++) {
          nextCell = areas[i].getCellInGlobalPosition(vec.x, vec.y)
          if (nextCell) break
      }
      if (nextCell) {
        nextCell.setExistingObject(object);
      } else {
        if (!object.container)
          this.lastCellContainer?.setExistingObject(object);
      }
      this.lastCellContainer = null;
    });
  }
}
