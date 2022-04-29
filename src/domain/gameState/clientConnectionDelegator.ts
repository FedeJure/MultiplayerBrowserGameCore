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
import { ClientPlayer } from "../player/players/clientPlayer";
import { Player } from "../player/players/player";
import { MovementSystem } from "../player/movement/movementSystem";
import { AnimationSystem } from "../player/animations/animationSystem";
import { DefaultPlayerStats, PlayerStats } from "../player/playerStats";
import { AttackTarget } from "../combat/attackTarget";
import { AttackTargetType } from "../combat/attackTargetType";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: Scene,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<Player>,
    private attackTargetRepository: SimpleRepository<AttackTarget>
  ) {}
  init(): void {
    this.connection.onInitialGameState.subscribe(async (data) => {
      Log(this, "Initial Game State Event", data);
      this.createLocalClientPlayer(
        data.localPlayer.state,
        data.localPlayer.info,
        data.localPlayer.stats
      );
      for (let i = 0; i < data.players.length; i++) {
        const dto = data.players[i];
        if (dto.id === data.localPlayer.id) continue;
        this.createClientPlayer(dto.state, dto.info);
      }

      this.connection.onNewPlayerConnected.subscribe((data) => {
        if (this.inGamePlayersRepository.get(data.player.id)) return;
        this.createClientPlayer(data.player.state, data.player.info);
      });

      this.connection.onPlayerDisconnected.subscribe((data) => {
        const player = this.inGamePlayersRepository.get(data.playerId);
        if (player) {
          this.attackTargetRepository.remove(
            player.view.matterBody.id.toString()
          );
          player.destroy();
          this.inGamePlayersRepository.remove(data.playerId);
        }
      });
    });

    this.scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      this.connection.emitStartNewConnection(this.localPlayerId);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  createClientPlayer(state: PlayerState, info: PlayerInfo) {
    const collisionResolver = new PhaserCombatCollisionResolver(
      state.position.x,
      state.position.y,
      this.scene,
      this.attackTargetRepository
    );
    const view = new ClientPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      collisionResolver
    );
    this.attackTargetRepository.save(view.matterBody.id.toString(), {
      id: info.id,
      type: AttackTargetType.PLAYER,
    });
    const player = new ClientPlayer(info, state, view);
    this.presenterProvider.forPlayer(player, view);
    this.inGamePlayersRepository.save(player.info.id, player);
  }

  createLocalClientPlayer(
    state: PlayerState,
    info: PlayerInfo,
    stats: PlayerStats
  ) {
    const collisionResolver = new PhaserCombatCollisionResolver(
      state.position.x,
      state.position.y,
      this.scene,
      this.attackTargetRepository
    );

    const view = new ClientPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      collisionResolver
    );
    this.attackTargetRepository.save(view.matterBody.id.toString(), {
      id: info.id,
      type: AttackTargetType.PLAYER,
    });
    const input = new PlayerKeyBoardInput(this.scene.input.keyboard);

    const movementSystem = new MovementSystem();
    const player = new LocalClientPlayer(
      info,
      state,
      view,
      this.inGamePlayersRepository,
      stats ?? DefaultPlayerStats,
      movementSystem,
      input
    );
    const inventory = new ClientInventoryView(this.scene, input);
    this.presenterProvider.forInventory(info.id, inventory);
    this.presenterProvider.forLocalPlayer(input, player, view);
    this.inGamePlayersRepository.save(player.info.id, player);
  }
}
