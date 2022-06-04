import { GameObjects, Scene } from "phaser";
import { CellView } from "./CellView";
import { ObjectDetailView } from "./objectDetailView";
import { UiObject } from "./UiObject";
import { DraggableContext } from "./DraggableContext";

export interface ContainerDto {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  title?: string;
}

type CellContainerConfig = {
  padding: number;
  title?: string;
};

export class CellContainerView extends GameObjects.GameObject {
  protected container: GameObjects.Container;
  private objectsCells: CellView[] = [];
  private titleHeight: number = 0;

  private config: CellContainerConfig = {
    padding: 0,
  };

  private lastCellContainer: CellView | null = null;

  constructor(
    scene: Scene,
    draggableContext: DraggableContext,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private containers: ContainerDto[],
    config?: CellContainerConfig
  ) {
    super(scene, "ClientInventoryView");
    this.config = config ?? this.config;
    this.container = this.scene.add.container(0, 0);
    this.container.setVisible(false);
    this.scene.add.group(this, { runChildUpdate: true });
    if (config?.title) {
      const title = scene.add.text(0, 0, config!.title, { color: "#808080" });

      this.container.add(title);
      title.setPosition(width / 2 - title.width / 2, title.height / 2);
      this.container.bringToTop(title);
      this.titleHeight = title.height;
    }
    this.initBackgrounds();

    this.containers.forEach(this.createCell.bind(this));
    this.setupPosition();

    this.scene.scale.addListener(Phaser.Scale.Events.RESIZE, () => {
      this.setupPosition();
    });
  }

  setupPosition() {
    this.container.setPosition(this.x, this.y);
  }

  initBackgrounds() {
    const background = this.scene.add
      .image(0, 0, "inventoryBackground")
      .setDisplaySize(
        this.width + this.config.padding * 2,
        this.height + this.config.padding * 2 + this.titleHeight
      )
      .setOrigin(0, 0);
    this.width = background.width;
    this.height = background.height;
    this.container.add(background);
    this.container.sendToBack(background);
  }

  addObject(id: number, object: UiObject) {
    const cell = this.objectsCells.find((c) => c.id === id);
    if (!cell) throw new Error("Cell not found");
    if (!cell.isEmpty) throw new Error("Cell not empty");

    cell.setObject(object);
  }

  getCellInGlobalPosition(x: number, y: number): CellView | undefined {
    return this.objectsCells
      .filter((o) => o.getBounds().contains(x, y))
      .sort(
        (a, b) =>
          new Phaser.Math.Vector2(
            a.getBounds().centerX,
            a.getBounds().centerY
          ).distance({ x, y }) -
          new Phaser.Math.Vector2(
            b.getBounds().centerX,
            b.getBounds().centerY
          ).distance({ x, y })
      )[0];
  }


  createCell({ x, y, width, height, id, title }: ContainerDto) {
    const cell = new CellView(
      id,
      this.scene,
      x + this.config.padding,
      y + this.config.padding + this.titleHeight,
      width,
      height,
      title
    );
    this.objectsCells.push(cell);
    this.container.add(cell);
  }
}
