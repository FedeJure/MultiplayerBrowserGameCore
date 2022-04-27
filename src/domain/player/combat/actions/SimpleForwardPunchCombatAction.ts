import { CombatAction } from "./combatAction";
import { LocalClientPlayer } from "../../players/localClientPlayer";
import { ServerPlayer } from "../../players/serverPlayer";
import { Player } from "../../players/player";
import { SimpleRepository } from "../../../repository";
import { AttackTarget } from "../../../combat/attackTarget";

export class SimpleForwardPunchCombatAction implements CombatAction {
  constructor(
    private inGamePlayersRepository: SimpleRepository<Player>,
    private attackTargetRepository: SimpleRepository<AttackTarget>
  ) {}
  execute(player: LocalClientPlayer | ServerPlayer) {
    const { input } = player;
    if (
      !player.state.attacking &&
      input.basicAttack &&
      !input.up &&
      !input.down
    ) {
      if (player.state.grounded) {
        player.updateState({
          velocity: { x: 0, y: 0 },
        });
      }

      player.updateState({
        attacking: true,
      });
      player.view.scene.time.delayedCall(450, () => {
        player.updateState({ attacking: false });
        player.view.combatCollisionResolver.disableMeleeCollision();
      });
      player.view.combatCollisionResolver.onMeleeTarget.subscribe((targets) => {
        console.log(targets);
      });
      player.view.combatCollisionResolver.enableMeleeCollision();
    }
  }
}
