import { CombatAction } from "../../combat/combatAction";
import { ControllablePlayer } from "../players/controllablePlayer";
import { CombatResult } from "./combatResult";
import { EntityAnimationCode, AnimationLayer } from "../../entity/animations";
import { MapManager } from "../../environment/mapManager";
import { DefaultEntityCombat } from "../../entity/DefaultEntityCombat";

export class CombatSystem extends DefaultEntityCombat {
  private attacking: boolean;
  private player: ControllablePlayer;
  constructor(
    private mapMapanger: MapManager,
    private actions: CombatAction[]
  ) {
    super();
  }
  init(player: ControllablePlayer) {
    this.player = player;
    super.init(player);
    this.actions.forEach((a) => a.init(player));
  }

  update(time: number, delta: number) {
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
    super.update(time, delta);
  }

  receiveAttack(attack: CombatResult) {
    if (attack.damage > 0)
      this.player.animations.executeAnimation(
        EntityAnimationCode.TAKING_DAMAGE,
        AnimationLayer.COMBAT,
        false,
        200
      );
    this.player.updateState({
      life: this.player.state.life - attack.damage,
    });
    if (this.player.state.isAlive && this.player.state.life <= 0) this.die();
  }

  private die() {
    const dieDuration = 1000;
    this.player.animations.executeAnimation(
      EntityAnimationCode.DIE,
      AnimationLayer.MOVEMENT,
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
    const newPosition = closestSpawnPosition[0] ?? { x: 0, y: 0 };
    this.player.updateState({ isAlive: false });
    this.player.view.scene.time.delayedCall(dieDuration, () => {
      console.log("asdasdasd");
      this.player.view.setPosition(newPosition.x, newPosition.y);
      this.player.updateState({
        life: this.player.stats.maxLife,
        anim: [],
        position: newPosition,
        isAlive: true,
      });
    });
  }

  override bringExperience(exp: number) {
    this.player.updateState({ exp: this.player.state.exp + exp });
  }
}
