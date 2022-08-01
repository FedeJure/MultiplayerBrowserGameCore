import { Entity } from "../../entity/entity";
import { PlayerView } from "../../playerView";
import { ClientRemotePlayerMovement } from "../movement/clientRemotePlayerMovement";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class ClientRemotePlayer extends Entity<PlayerInfo, PlayerState, PlayerView, PlayerStats> {
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    stats: PlayerStats
  ) {
    super(info, state,view,stats, new ClientRemotePlayerMovement());
  }
}
