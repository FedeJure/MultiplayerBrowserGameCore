import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { ClientInventoryView } from "../../view/clientInventoryView";
import { ClientPlayerView } from "../../view/player/clientPlayerView";
import { Delegator } from "../delegator";
import { LocalClientPlayer } from "../player/players/localClientPlayer";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { ServerConnection } from "../serverConnection";
import { PlayerState } from "../player/playerState";
import { PlayerInfo } from "../player/playerInfo";
import { SimpleRepository } from "../repository";
import { Scene } from "phaser";
import { CombatSystem } from "../player/combat/combatSystem";
import { SimpleForwardPunchCombatAction } from "../player/combat/actions/SimpleForwardPunchCombatAction";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: Scene,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<LocalClientPlayer>
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
          const combatSystem = new CombatSystem([
            new SimpleForwardPunchCombatAction(),
            new SimpleForwardPunchCombatAction(),
          ]);

          const player = new LocalClientPlayer(
            dto.info,
            dto.state,
            view,
            combatSystem,
          );
          const inventory = new ClientInventoryView(this.scene, input);
          this.presenterProvider.forInventory(dto.info.id, inventory);
          this.presenterProvider.forLocalPlayer(input, player, view);
          this.inGamePlayersRepository.save(player.info.id, player);
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
    const combatSystem = new CombatSystem([
      new SimpleForwardPunchCombatAction(),
      new SimpleForwardPunchCombatAction(),
    ]);
    const player = new LocalClientPlayer(
      info,
      state,
      view,
      combatSystem,
    );
    this.presenterProvider.forPlayer(player, view);
    this.inGamePlayersRepository.save(player.info.id, player);
  }
}
