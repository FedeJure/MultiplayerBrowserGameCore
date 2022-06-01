import { GameObjects, Scene } from "phaser";
import { GenericObjectCellView } from "./CellView";
import { ObjectDetailView } from "../itemDetailView";
import { UiObject } from "./UiObject";

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
  private objectsCells: GenericObjectCellView[] = [];
  private objectDetailPanel: ObjectDetailView;
  private titleHeight: number = 0;

  private config: CellContainerConfig = {
    padding: 0,
  };

  constructor(
    scene: Scene,
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
      const title = scene.add.text(0, 0, config!.title, {color: "#808080"});
      
      this.container.add(title);
      title.setPosition( (width / 2) - (title.width / 2), title.height / 2)
      this.container.bringToTop(title)
      this.titleHeight = title.height;
    }
    this.initBackgrounds();

    this.containers.forEach(this.createCell.bind(this));
    this.setupPosition();

    this.scene.scale.addListener(Phaser.Scale.Events.RESIZE, () => {
      this.setupPosition();
    });
    this.objectDetailPanel = new ObjectDetailView(scene);
    this.objectDetailPanel.setVisible(false);
    this.container.add(this.objectDetailPanel);
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
    this.width = background.width
    this.height = background.height
    this.container.add(background);
    this.container.sendToBack(background)
    
  }

  addObject(id: number, object: UiObject) {
    const cell = this.objectsCells.find((c) => c.id === id);
    if (!cell) throw new Error("Cell not found");
    if (!cell.isEmpty) throw new Error("Cell not empty");

    cell.setObject(object);
  }

  createCell({ x, y, width, height, id, title }: ContainerDto) {
    const cell = new GenericObjectCellView(
      id,
      this.scene,
      x + this.config.padding,
      y + this.config.padding + this.titleHeight,
      width,
      height,
      title
    );

    cell.onMouseOver.subscribe((object) => {
      this.objectDetailPanel.setObject(object);
      this.objectDetailPanel.setVisible(true);
      this.objectDetailPanel.setPosition(cell.x, cell.y);
      this.container.bringToTop(this.objectDetailPanel);
    });

    cell.onMouseExit.subscribe(() => {
      this.objectDetailPanel.setVisible(false);
    });

    cell.onDragStart.subscribe(() => {
      this.objectDetailPanel.setVisible(false);
      this.container.bringToTop(cell);
    });

    cell.onObjectDrop.subscribe(({ object, gameObject }) => {
      const vec = new Phaser.Math.Vector2(
        gameObject.getBounds().centerX,
        gameObject.getBounds().centerY
      );

      const nextCell = this.objectsCells.sort(
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
      if (nextCell && nextCell !== cell) {
        try {
          nextCell.setObject(object);
          cell.removeObject();
        } catch (error) {
          cell.resetObjectState();
        }
      } else cell.resetObjectState();
    });

    this.objectsCells.push(cell);
    this.container.add(cell);
  }
}
