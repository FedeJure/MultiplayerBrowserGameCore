import { GameScene } from "../view/scenes/GameScene";
import { Delegator } from "../domain/delegator";

export class ServerGamePresenter {
  constructor(
    private readonly gameScene: GameScene,
    private readonly delegators: Delegator[]
  ) {
    this.delegators.forEach((d) => d.init());
    this.gameScene.onUpdate.subscribe(({ time, delta }) =>
      this.delegators.forEach((d) => d.update(time, delta))
    );
  }
}
