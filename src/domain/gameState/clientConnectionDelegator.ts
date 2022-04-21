import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { ClientInventoryView } from "../../view/clientInventoryView";
import { ClientPlayerView } from "../../view/clientPlayerView";
import { GameScene } from "../../view/scenes/GameScene";
import { CreateClientPlayerAction } from "../actions/provideClientPlayer";
import { Delegator } from "../delegator";
import { Player2_0 } from "../player/player2.0";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { PlayersRepository2_0 } from "../player/playersRepository2.0";
import { ServerConnection } from "../serverConnection";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: GameScene,
    private createClientPlayerAction: CreateClientPlayerAction,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: PlayersRepository2_0,
  ) {}
  init(): void {
    this.connection.onInitialGameState.subscribe((data) => {
      Log(this, "Initial Game State Event", data);
      for (let i = 0; i < data.players.length; i++) {
        const dto = data.players[i];
        if (dto.id === this.localPlayerId) {
          const view = new ClientPlayerView(
            this.scene,
            dto.state.position.x,
            dto.state.position.y,
            DefaultConfiguration.height,
            DefaultConfiguration.width
          );
          const input = new PlayerKeyBoardInput(this.scene.input.keyboard)
          const player = new Player2_0(dto.info, dto.state, view, );
          const inventory = new ClientInventoryView(this.scene, input)
          this.presenterProvider.forInventory(dto.info.id, inventory)
          this.presenterProvider.forLocalPlayer(input, player, view);
          this.inGamePlayersRepository.save(player);
        }
        else
          this.createClientPlayerAction.execute(
            dto.info,
            dto.state,
            this.scene
          );
      }

      this.connection.onNewPlayerConnected.subscribe((data) => {
        if (this.inGamePlayersRepository.get(data.player.id)) return;
        this.createClientPlayerAction.execute(
          data.player.info,
          data.player.state,
          this.scene
        );
      });

      this.connection.onPlayerDisconnected.subscribe((data) => {
        const player = this.inGamePlayersRepository.get(data.playerId)
        if (player) player.destroy()
        this.inGamePlayersRepository.remove(data.playerId);
      });
    });

    this.scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      this.connection.emitStartNewConnection(this.localPlayerId);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
