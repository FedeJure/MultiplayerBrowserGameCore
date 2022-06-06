import { GameObjects, Scene } from "phaser";
import { ItemCellView } from "./ItemCellView";
import { ItemType } from "../../domain/items/itemType";
import { Observable, Subject } from "rxjs";
import { UiItemView } from "./UiItemView";
import { Item } from "../../domain/items/item";

export interface ContainerDto {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  allowedTypes: ItemType[];
  title?: string;
}

type CellContainerConfig = {
  padding: number;
  title?: string;
};

type ItemChangePayload = {
  item: Item;
  cellId: number;
};

export class CellContainerView extends GameObjects.GameObject {
  private _onItemSaved: Subject<ItemChangePayload> = new Subject();
  private _onItemRemoved: Subject<ItemChangePayload> = new Subject();
  protected container: GameObjects.Container;
  private objectsCells: ItemCellView[] = [];
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

  addObject(id: number, object: Item) {
    const cell = this.objectsCells.find((c) => c.id === id);
    if (!cell) throw new Error("Cell not found");
    if (!cell.isEmpty) throw new Error("Cell not empty");

    cell.setExistingObject(
      new UiItemView(
        this.scene,
        cell.width / 2,
        cell.height / 2,
        cell.width * 0.88,
        cell.height * 0.88,
        object.icon,
        object
      )
    );
  }

  getCellInGlobalPosition(
    x: number,
    y: number,
    types: ItemType[]
  ): ItemCellView | undefined {
    return this.objectsCells
      .filter((o) => types.some((t) => o.allowType(t)))
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

  createCell({ x, y, width, height, id, title, allowedTypes }: ContainerDto) {
    const cell = new ItemCellView(
      id,
      this.scene,
      x + this.config.padding,
      y + this.config.padding + this.titleHeight,
      width,
      height,
      allowedTypes,
      title
    );
    cell.onItemSaved.subscribe((item) => {
      this._onItemSaved.next({ item, cellId: cell.id });
    });

    cell.onItemRemoved.subscribe((item) => {
      this._onItemRemoved.next({ item, cellId: cell.id });
    });
    this.objectsCells.push(cell);
    this.container.add(cell);
  }

  public get onItemSaved(): Observable<ItemChangePayload> {
    return this._onItemSaved;
  }

  public get onItemRemoved(): Observable<ItemChangePayload> {
    return this._onItemRemoved;
  }
}
