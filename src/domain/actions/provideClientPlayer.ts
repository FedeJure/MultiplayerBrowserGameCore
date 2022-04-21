import { GameScene } from "../../view/scenes/GameScene";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { PlayerInfo } from "../player/playerInfo";
import { PlayerState } from "../player/playerState";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientPlayerView } from "../../view/clientPlayerView";
import { Player2_0 } from "../player/player2.0";
import { PlayersRepository2_0 } from "../player/playersRepository2.0";
export class CreateClientPlayerAction {
  constructor(
    private presenterProvider: ClientPresenterProvider,
    private playerStateRepository: PlayerStateRepository,
    private inGamePlayersRepository: PlayersRepository2_0
  ) {}

  public execute(info: PlayerInfo, state: PlayerState, scene: GameScene) {
    const view = new ClientPlayerView(
      scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    const player = new Player2_0(info, state, view);
    this.presenterProvider.forPlayer(player, view);
    this.inGamePlayersRepository.save(player);
    this.playerStateRepository.setPlayerState(info.id, player.state);
  }
}
