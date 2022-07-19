import { Delegator } from "../domain/delegator";

export class ViewPresenter {
  constructor(view: Phaser.GameObjects.GameObject, delegators: Delegator[]) {
    delegators.forEach((d) => d.init());
    const scene = view.scene;

    const onUpdate = (time, delta) => {
      delegators.forEach((d) => d.update(time, delta));
    };
    const onPostUpdate = () => {
      delegators.forEach((d) =>  d.postUpdate && d.postUpdate());
    };
    view.on(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off(Phaser.Scenes.Events.POST_UPDATE, onPostUpdate);
      scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate);
      delegators.forEach((d) => d.stop());
    });
    scene.events.addListener(Phaser.Scenes.Events.UPDATE, onUpdate);
    scene.events.addListener(Phaser.Scenes.Events.POST_UPDATE, onPostUpdate);
    
  }
}
