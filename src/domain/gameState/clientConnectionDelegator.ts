import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { ClientInventoryView } from "../../view/clientInventoryView";
import { ClientPlayerView } from "../../view/clientPlayerView";
import { GameScene } from "../../view/scenes/GameScene";
import { Delegator } from "../delegator";
import { ClientPlayer } from "../player/player";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { InGamePlayersRepository } from "../player/inGamePlayersRepository";
import { ServerConnection } from "../serverConnection";
import { PlayerState } from "../player/playerState";
import { PlayerInfo } from "../player/playerInfo";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: GameScene,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: InGamePlayersRepository<ClientPlayer>
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
          const input = new PlayerKeyBoardInput(this.scene.input.keyboard);
          const player = new ClientPlayer(dto.info, dto.state, view);
          const inventory = new ClientInventoryView(this.scene, input);
          this.presenterProvider.forInventory(dto.info.id, inventory);
          this.presenterProvider.forLocalPlayer(input, player, view);
          this.inGamePlayersRepository.save(player);
        } else this.createClientPlayer(dto.state, dto.info);
      }

      this.connection.onNewPlayerConnected.subscribe((data) => {
        if (this.inGamePlayersRepository.get(data.player.id)) return;
        this.createClientPlayer(
          data.player.state,

          data.player.info
        );
      });

      this.connection.onPlayerDisconnected.subscribe((data) => {
        const player = this.inGamePlayersRepository.get(data.playerId);
        if (player) player.destroy();
        this.inGamePlayersRepository.remove(data.playerId);
      });
    });

    this.scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      this.connection.emitStartNewConnection(this.localPlayerId);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  createClientPlayer(state: PlayerState, info: PlayerInfo) {
    const view = new ClientPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    const player = new ClientPlayer(info, state, view);
    this.presenterProvider.forPlayer(player, view);
    this.inGamePlayersRepository.save(player);
  }
}
