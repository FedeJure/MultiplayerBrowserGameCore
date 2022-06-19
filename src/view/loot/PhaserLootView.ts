import { Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { Loot } from "../../domain/loot/loot";
import { LootView } from "../../domain/loot/lootView";

export class PhaserLootView
  extends Phaser.GameObjects.Image
  implements LootView
{
  private _onDestroy = new Subject<void>();
  constructor(scene: Scene, loot: Loot) {
    super(scene, loot.position.x, loot.position.y, "");
    this.setData('lootId', loot.id)
  }
  get onDestroy(): Observable<void> {
    return this._onDestroy;
  }
}
