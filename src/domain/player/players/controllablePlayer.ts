import { Attackable } from "../../combat/attackTarget";
import { CollisionableTargetType } from "../../combat/attackTargetType";
import { Entity } from "../../entity/entity";
import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { Inventory } from "../../inventory/inventory";
import { Item } from "../../items/item";
import { PlayerView } from "../../playerView";
import { DefendCombatAction } from "../combat/actions/DefendCombatAction";
import { SimpleForwardPunchCombatAction } from "../combat/actions/SimpleForwardPunchCombatAction";
import { CombatSystem } from "../combat/combatSystem";
import { PlayerMovement } from "../movement/playerMovement";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class ControllablePlayer extends Entity<
  PlayerInfo,
  PlayerState,
  PlayerView,
  PlayerStats
> {
  constructor(
    _info: PlayerInfo,
    _state: PlayerState,
    _view: PlayerView,
    _stats: PlayerStats,
    _movementSystem: PlayerMovement,
    protected _input: PlayerInput,
    mapManager: MapManager, //usar esto para spawnear al jugador en un spot de spawn al morir.
    protected _inventory: Inventory<Item | Item['id']>,
    protected _balance: Balance
  ) {
    super(
      _info,
      _state,
      _view,
      _stats,
      _movementSystem,
      new CombatSystem(mapManager, [
        new SimpleForwardPunchCombatAction(),
        new DefendCombatAction(),
      ]),
    );
  }
  updateStats(newStats: Partial<PlayerStats>) {
    this._stats = { ...this.stats, ...newStats };
  }

  destroy() {
    this._view.destroy();
  }

  get input() {
    return this._input;
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  getAttackablesOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): Attackable[] {
    return this.view.combatCollisionResolver
      .getTargetsOnArea(x, y, width, height)
      .filter(
        (t) =>
          t.target !== this &&
          (t.type === CollisionableTargetType.PLAYER ||
            t.type === CollisionableTargetType.MOB)
      )
      .map((t) => t.target);
  }

  get inventory() {
    return this._inventory
  }

  get balance() {
    return this._balance
  }
}
