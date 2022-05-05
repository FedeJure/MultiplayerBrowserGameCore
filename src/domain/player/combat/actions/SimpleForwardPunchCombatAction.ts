import { CombatAction } from "./combatAction";
import { LocalClientPlayer } from "../../players/localClientPlayer";
import { Side } from "../../../side";
import { CombatResult } from "../combatResult";
import { AnimationCode, AnimationLayer } from "../../../animations/animations";

export class SimpleForwardPunchCombatAction implements CombatAction {
  private readonly range = 20;
  constructor(private player: LocalClientPlayer) {}

  execute() {
    const { input } = this.player;
    if (
      !this.player.state.attacking &&
      input.basicAttack &&
      !input.up &&
      !input.down
    ) {
      if (this.player.state.grounded) {
        this.player.updateState({
          velocity: { x: 0, y: 0 },
        });
      }
      const attackDuration = 1000 / this.player.stats.basicAttackSpeed;

      this.player.updateState({
        attacking: true,
      });
      this.player.animSystem.executeAnimation(
        AnimationCode.BASIC_ATTACK,
        AnimationLayer.COMBAT,
        false
      );

      this.player.view.scene.time.delayedCall(attackDuration, () => {
        this.player.updateState({
          attacking: false,
        });
      });

      const x =
        this.player.state.position.x -
        this.player.view.width / 2 -
        (this.player.state.side === Side.RIGHT ? 0 : this.range);
      const y = this.player.state.position.y;
      this.player
        .getPlayersOnArea(
          x,
          y,
          this.player.view.width + this.range,
          this.player.view.height / 2
        )
        .forEach((player) => {
          player.receiveAttack(this.getAttackResult());
        });
      return true;
    }
    return false;
  }

  getAttackResult(): CombatResult {
    return {
      damage: this.player.stats.meleeDamage,
    };
  }
}
