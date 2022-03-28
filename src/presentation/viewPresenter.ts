import { Delegator } from "../domain/delegator";

export class ViewPresenter {
  constructor(view: Phaser.GameObjects.GameObject, delegators: Delegator[]) {
    
    delegators.forEach((d) => d.init());
    view.scene.events.on("update", (time, delta) => {
      delegators.forEach((d) => d.update(time, delta));
    });
    view.on(Phaser.GameObjects.Events.REMOVED_FROM_SCENE, () => {
      delegators.forEach((d) => d.stop());
    });
  }
}
