import { Delegator } from "../domain/delegator";

export class ViewPresenter {
  constructor(view: Phaser.GameObjects.GameObject, delegators: Delegator[]) {
    delegators.forEach((d) => d.init());
    const scene = view.scene;

    const onUpdate = (time, delta) => {
      delegators.forEach((d) => d.update(time, delta));
    };
    view.on(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate);
      delegators.forEach((d) => d.stop());
    });
    scene.events.addListener(Phaser.Scenes.Events.UPDATE, onUpdate);
  }
}