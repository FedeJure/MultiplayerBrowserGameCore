import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { GameScene } from "../../view/scenes/GameScene";
import { CreateClientPlayerAction } from "../actions/provideClientPlayer";
import { CreateLocalClientPlayer } from "../actions/provideLocalClientPlayer";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: GameScene,
    private createClientPlayerAction: CreateClientPlayerAction,
    private createLocalPlayerAction: CreateLocalClientPlayer,
    private playersRepository: ConnectedPlayersRepository
  ) {}
  init(): void {
    this.connection.onInitialGameState.subscribe((data) => {
      Log(this, "Initial Game State Event", data);
      for (let i = 0; i < data.players.length; i++) {
        const dto = data.players[i];
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
      }

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

    this.scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      this.connection.emitStartNewConnection(this.localPlayerId);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
