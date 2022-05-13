import { AttackTargetType } from "../../combat/attackTargetType";
import { MapManager } from "../../environment/mapManager";
import { PlayerView } from "../../playerView";
import { SimpleRepository } from "../../repository";
import { AnimationSystem } from "../animations/animationSystem";
import { DefendCombatAction } from "../combat/actions/DefendCombatAction";
import { SimpleForwardPunchCombatAction } from "../combat/actions/SimpleForwardPunchCombatAction";
import { CombatResult } from "../combat/combatResult";
import { CombatSystem } from "../combat/combatSystem";
import { MovementSystem } from "../movement/movementSystem";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";
import { ClientPlayer } from "./clientPlayer";
import { Player } from "./player";

export class ControllablePlayer extends ClientPlayer {
  protected _combatSystem: CombatSystem;
  protected _animationSystem: AnimationSystem;
  constructor(
    _info: PlayerInfo,
    _state: PlayerState,
    _view: PlayerView,
    private inGamePlayersRepository: SimpleRepository<Player>,
    protected _stats: PlayerStats,
    private _movementSystem: MovementSystem,
    private _input: PlayerInput,
    mapManager: MapManager //usar esto para spawnear al jugador en un spot de spawn al morir.
  ) {
    super(_info, _state, _view);
    this._animationSystem = new AnimationSystem(this);
    this._combatSystem = new CombatSystem(this, mapManager, [
      new SimpleForwardPunchCombatAction(this),
      new DefendCombatAction(this)
    ]);
  }

  updateInfo(newInfo: Partial<PlayerInfo>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<PlayerState>) {
    this._state = { ...this.state, ...newState };
  }

  updateStats(newStats: Partial<PlayerStats>) {
    this._stats = { ...this.stats, ...newStats };
  }

  destroy() {
    this._view.destroy();
  }

  get info() {
    return this._info;
  }
  get state() {
    return this._state;
  }
  get view() {
    return this._view;
  }
  get input() {
    return this._input;
  }
  get stats() {
    return this._stats;
  }

  get animSystem() {
    return this._animationSystem;
  }

  update(time: number, delta: number) {
    this._combatSystem.processCombat(delta);
    this._movementSystem.processMovement(this, delta);
    this._animationSystem.processAnimation(this);
    super.update(time, delta);
  }

  receiveAttack(attack: CombatResult) {
    this._combatSystem.receiveAttack(attack);
  }

  getPlayersOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): Player[] {
    return this.view.combatCollisionResolver
      .getTargetsOnArea(x, y, width, height)
      .filter(
        (t) => t.type === AttackTargetType.PLAYER && t.id !== this.info.id
      )
      .map((t) => this.inGamePlayersRepository.get(t.id))
      .filter((p) => p !== undefined) as Player[];
  }
}
