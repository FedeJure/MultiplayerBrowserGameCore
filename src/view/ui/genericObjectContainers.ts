import { GameObjects, Scene } from "phaser";
import { PlayerInput } from "../../domain/player/playerInput";
import { GenericObjectCellView } from "../clientInventoryItemView";
import { ObjectDetailView } from "../itemDetailView";
import { UiObject } from "./UiObject";

export interface ContainerDto {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
}

export class GenericObjectContainers
  extends GameObjects.GameObject
{
  private container: GameObjects.Container;
  private canChange: boolean = false;
  private objectsCells: GenericObjectCellView[] = [];
  private objectDetailPanel: ObjectDetailView;

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
        this.height + this.config.padding * 2
      )
      .setOrigin(0, 0);
    this.container.add(background);

    this.containers.forEach(this.createCell.bind(this));
  }

  addObject(id: number, object: UiObject) {
    const cell = this.objectsCells.find((c) => c.id === id);
    if (!cell) throw new Error("Cell not found");
    if (!cell.isEmpty) throw new Error("Cell not empty");

    cell.setObject(object);
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

  createCell({ x, y, width, height, id }: ContainerDto) {
    const cell = new GenericObjectCellView(
      id,
      this.scene,
      x + this.config.padding,
      y + this.config.padding,
      width,
      height
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

    cell.onItemDrop.subscribe(({object, gameObject}) => {
      const vec = new Phaser.Math.Vector2(
        gameObject.getBounds().centerX,
        gameObject.getBounds().centerY
      );

      const nextItemContainer = this.objectsCells.sort(
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
      if (nextItemContainer && nextItemContainer !== cell) {
        try {
          nextItemContainer.setObject(object);
          cell.removeItem();
        } catch (error) {
          cell.resetItemState();
        }
      } else cell.resetItemState();
    });

    this.objectsCells.push(cell);
    this.container.add(cell);
  }
}
