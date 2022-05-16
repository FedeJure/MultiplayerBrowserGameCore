import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ControllablePlayer } from "../player/players/controllablePlayer";

export class PlayerCollisionDelegator implements Delegator {

  private readonly disposer: Disposer = new Disposer();

  constructor(private player: ControllablePlayer) {
  }
  update(time: number, delta: number): void {}

  init(): void {
    this.disposer.add(
      this.player.view.onGroundCollideChange.subscribe((grounded) => {
        this.player.updateState({grounded})
      })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }
}
