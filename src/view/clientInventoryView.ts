import { GameObjects, Scene } from "phaser";
import { InventoryView } from "../domain/items/inventoryView";
import { PlayerInput } from "../domain/player/playerInput";
import { SceneNames } from "./scenes/SceneNames";
import { loadAssetAsync } from "./utils";

export class ClientInventoryView
  extends GameObjects.GameObject
  implements InventoryView
{
  private container: GameObjects.Container;
  private canChange: boolean = false

  constructor(scene: Scene, private userInput: PlayerInput) {
    super(scene.scene.get(SceneNames.ClientHudScene), "ClientInventoryView");
    this.container = this.scene.add.container(0, 0);
    this.container.setVisible(false)
    this.scene.add.group(this, { runChildUpdate: true });
    this.loadTestImages();
  }

  async loadTestImages() {
    await loadAssetAsync(this.scene, () => {
      this.scene.load.image(
        "testItem",
        "https://c8.alamy.com/compes/2e3b3ca/dados-de-juego-con-agujeros-cubos-cuadrados-para-jugar-2e3b3ca.jpg"
      );
    });
    const image = this.scene.add
      .image(100, 100, "testItem")
      .setDisplaySize(50, 50);
    this.container.add(image);
  }

  update(): void {
    if (this.canChange && this.userInput.inventory && !this.container.visible ) {
        this.container.setVisible(true)
        this.canChange = false
        return
    }
    if (this.canChange && this.userInput.inventory && this.container.visible) {
        this.container.setVisible(false)
        this.canChange = false
        return
    }
    if (!this.userInput.inventory && !this.canChange) this.canChange = true
  }
}
