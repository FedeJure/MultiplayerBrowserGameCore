import { CombatAction } from "./actions/combatAction";
import { ControllablePlayer } from "../players/controllablePlayer";
import { CombatResult } from "./combatResult";
import { AnimationCode, AnimationLayer } from "../../animations/animations";
import { MapManager } from "../../environment/mapManager";

export class CombatSystem {
  private attacking: boolean;
  constructor(
    private player: ControllablePlayer,
    private mapMapanger: MapManager,
    private actions: CombatAction[]
  ) {}

  processCombat(delta: number) {
    if (!this.attacking) {
      for (const action of this.actions) {
        const execution = action.execute();
        if (execution) {
          this.player.updateState({ attacking: true });
          this.attacking = true;
          this.player.view.scene.time.delayedCall(execution.duration, () => {
            this.attacking = false;
          });
          return;
        }
      }
      this.player.updateState({ attacking: false });
    }
  }

  receiveAttack(attack: CombatResult) {
    if (attack.damage > 0)
      this.player.animSystem.executeAnimation(
        AnimationCode.TAKING_DAMAGE,
        AnimationLayer.COMBAT,
        false,
        200
      );
    this.player.updateState({
      life: this.player.state.life - attack.damage,
    });
    if (this.player.state.life <= 0) this.die();
  }

  private die() {
    const dieDuration = 1000;
    this.player.animSystem.executeAnimation(
      AnimationCode.DIE,
      AnimationLayer.COMBAT,
      false,
      dieDuration
    );
    const closestSpawnPosition = this.mapMapanger
      .getMap(this.player.state.mapId)
      .spawnPositions.sort((p1, p2) => {
        return (
          Math.sqrt(
            Math.pow(p1.x - this.player.state.position.x, 2) +
              Math.pow(p1.y - this.player.state.position.y, 2)
          ) -
          Math.sqrt(
            Math.pow(p2.x - this.player.state.position.x, 2) +
              Math.pow(p2.y - this.player.state.position.y, 2)
          )
        );
      });
    const newPosition = closestSpawnPosition[0] ?? { x: 100, y: 100 };
    this.player.view.scene.time.delayedCall(dieDuration, () => {
      this.player.view.setPosition(newPosition.x, newPosition.y);
      this.player.updateState({
        life: this.player.stats.maxLife,
        anim: [],
        position: newPosition,
      });
    });
  }
}
