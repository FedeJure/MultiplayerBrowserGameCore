import { GameScene } from "../view/scenes/GameScene";
import { CreateClientPlayerAction } from "../domain/actions/provideClientPlayer";
import { CreateLocalClientPlayer } from "../domain/actions/provideLocalClientPlayer";
import { ServerConnection } from "../domain/serverConnection";
import { Log } from "../infrastructure/Logger";
import { PlayerKeyBoardInput } from "../infrastructure/input/playerKeyboardInput";
import { ConnectedPlayersRepository } from "../infrastructure/repositories/connectedPlayersRepository";
import { Delegator } from "../domain/delegator";

export class ClientGamePresenter {
  constructor(
    private readonly localPlayerId: string,
    private readonly connection: ServerConnection,
    private readonly scene: GameScene,
    private readonly createClientPlayerAction: CreateClientPlayerAction,
    private readonly createLocalPlayerAction: CreateLocalClientPlayer,
    private readonly playersRepository: ConnectedPlayersRepository,
    delegators: Delegator[]
  ) {
    this.listenEvents();

    scene.onCreate.subscribe(() => {
      connection.emitStartNewConnection(localPlayerId);
      delegators.forEach((d) => d.init());
      scene.onUpdate.subscribe(({ time, delta }) => {
        delegators.forEach((d) => d.update(time, delta));
      });
      
    });
  }

  listenEvents() {
    this.connection.onInitialGameState.subscribe((data) => {
      Log(this, "Initial Game State Event", data);
      data.players.forEach((dto) => {
        if (dto.id === this.localPlayerId)
          this.createLocalPlayerAction.execute(
            dto.info,
            dto.state,
            this.scene,
            new PlayerKeyBoardInput(this.scene.input.keyboard)
          );
        else
          this.createClientPlayerAction.execute(
            dto.info,
            dto.state,
            this.scene
          );
      });

      this.connection.onNewPlayerConnected.subscribe((data) => {
        if (this.playersRepository.getPlayer(data.player.id)) return;
        this.createClientPlayerAction.execute(
          data.player.info,
          data.player.state,
          this.scene
        );
      });

      this.connection.onPlayerDisconnected.subscribe((data) => {
        this.playersRepository.removePlayer(data.playerId);
      });
    });
  }
}
