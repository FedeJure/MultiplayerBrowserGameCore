import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { PlayerInventory } from "../../inventory/playerInventory";
import { PlayerView } from "../../playerView";
import { PlayerMovement } from "../movement/playerMovement";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";
import { ControllablePlayer } from "./controllablePlayer";

export class LocalCLientPlayer extends ControllablePlayer {
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    stats: PlayerStats,
    movementSystem: PlayerMovement,
    input: PlayerInput,
    inventory: PlayerInventory,
    mapManager: MapManager,
    balance: Balance
  ) {
    super(info, state, view, stats, movementSystem, input, mapManager, inventory, balance);
  }
}
