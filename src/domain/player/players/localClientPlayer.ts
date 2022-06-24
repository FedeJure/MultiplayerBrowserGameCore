import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { ClientInventory } from "../../inventory/playerInventory";
import { PlayerView } from "../../playerView";
import { PlayerMovement } from "../movement/playerMovement";
import { PlayerInfo } from "../playerInfo";
import { ClientPlayerInput, PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";
import { ControllablePlayer } from "./controllablePlayer";

export class LocalClientPlayer extends ControllablePlayer {
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    stats: PlayerStats,
    movementSystem: PlayerMovement,
    input: ClientPlayerInput,
    inventory: ClientInventory,
    mapManager: MapManager,
    balance: Balance
  ) {
    super(
      info,
      state,
      view,
      stats,
      movementSystem,
      input,
      mapManager,
      inventory,
      balance
    );
  }
  
  get input(): ClientPlayerInput {
    return this._input as ClientPlayerInput;
  }

  get inventory() {
    return this._inventory as ClientInventory;
  }
}
