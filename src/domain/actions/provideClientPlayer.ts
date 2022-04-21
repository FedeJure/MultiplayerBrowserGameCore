import { GameScene } from "../../view/scenes/GameScene";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { PlayerInfo } from "../player/playerInfo";
import { PlayerState } from "../player/playerState";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientPlayerView } from "../../view/clientPlayerView";
import { Player } from "../player/player";
import { InGamePlayersRepository } from "../player/inGamePlayersRepository";
export class CreateClientPlayerAction {
  constructor(
    private presenterProvider: ClientPresenterProvider,
    private playerStateRepository: PlayerStateRepository,
    private inGamePlayersRepository: InGamePlayersRepository
  ) {}

  public execute(info: PlayerInfo, state: PlayerState, scene: GameScene) {
    const view = new ClientPlayerView(
      scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    const player = new Player(info, state, view);
    this.presenterProvider.forPlayer(player, view);
    this.inGamePlayersRepository.save(player);
    this.playerStateRepository.setPlayerState(info.id, player.state);
  }
}
