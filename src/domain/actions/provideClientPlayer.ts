import { GameScene } from "../../view/scenes/GameScene";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { PlayerInfo } from "../player/playerInfo";
import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientPlayerView } from "../../view/clientPlayerView";
export class CreateClientPlayerAction {
  private readonly presenterProvider: ClientPresenterProvider;
  private readonly connectedPlayersRepository: ConnectedPlayersRepository;
  private readonly playerStateRepository: PlayerStateRepository;
  constructor(
    presenterProvider: ClientPresenterProvider,
    connectedPlayersRepository: ConnectedPlayersRepository,
    playerStateRepository: PlayerStateRepository
  ) {
    this.presenterProvider = presenterProvider;
    this.connectedPlayersRepository = connectedPlayersRepository;
    this.playerStateRepository = playerStateRepository
  }

  public execute(info: PlayerInfo, state: PlayerState, scene: GameScene) {
    const view = new ClientPlayerView(
      scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    const player = new Player(
      info,
      state,
      view
    );
    this.presenterProvider.forPlayer(player);
    this.connectedPlayersRepository.savePlayer(info.id, player);
    this.playerStateRepository.setPlayerState(info.id, player.state);
    scene.addToLifecycle(view);
  }
}
