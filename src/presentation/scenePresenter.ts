import { Delegator } from "../domain/delegator";

export class ScenePresenter {
  constructor(scene: Phaser.Scene, delegators: Delegator[]) {
    delegators.forEach((d) => d.init());
    const onUpdate = (time, delta) => {
      delegators.forEach((d) => d.update(time, delta));
    };
    scene.events.addListener(Phaser.Scenes.Events.UPDATE, onUpdate);
    scene.events.addListener(Phaser.Scenes.Events.DESTROY, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate);

      delegators.forEach((d) => d.stop());
    });
  }
}
