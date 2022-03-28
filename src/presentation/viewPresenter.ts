import { Delegator } from "../domain/delegator";

export class ViewPresenter {
  constructor(
    view: Phaser.GameObjects.GameObject | Phaser.Scene,
    delegators: Delegator[]
  ) {
    delegators.forEach((d) => d.init());
    if (view instanceof Phaser.GameObjects.GameObject) {
      view.scene.events.on("update", (time, delta) => {
        delegators.forEach((d) => d.update(time, delta));
      });
      view.on(Phaser.GameObjects.Events.REMOVED_FROM_SCENE, () => {
        delegators.forEach((d) => d.stop());
      });
    } else {
      view.events.on("update", (time, delta) => {
        delegators.forEach((d) => d.update(time, delta));
      });
      view.events.on(Phaser.Scenes.Events.DESTROY, () => {
        delegators.forEach((d) => d.stop());
      });
    }
  }
}
