import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { PlayerView } from "../../view/playerView";
import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";

export class Player2_0 {
  constructor(
    private info: PlayerInfo,
    private state: PlayerState,
    private view: PlayerView,
    private infoRepository: PlayerInfoRepository,
    private stateRepository: PlayerStateRepository
  ) {
    
  }

  updateInfo(newInfo: Partial<PlayerInfo>) {
      this.info = {...this.info, ...newInfo}
  }

  updateState(newState: Partial<PlayerState>) {
      this.state = {...this.state, ...newState}
  }
}
