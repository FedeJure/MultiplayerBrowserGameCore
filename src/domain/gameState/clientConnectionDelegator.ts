import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { ClientPlayerView } from "../../view/player/clientPlayerView";
import { Delegator } from "../delegator";
import { ControllablePlayer } from "../player/players/controllablePlayer";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { ServerConnection } from "../serverConnection";
import { PlayerState } from "../player/playerState";
import { PlayerInfo } from "../player/playerInfo";
import { SimpleRepository } from "../repository";
import { Scene } from "phaser";
import { Player } from "../player/players/player";
import { PlayerMovement } from "../player/movement/playerMovement";
import { DefaultPlayerStats, PlayerStats } from "../player/playerStats";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { AttackTargetType } from "../combat/attackTargetType";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { MapManager } from "../environment/mapManager";
import { CollisionManager } from "../collisions/collisionManager";
import { HtmlInventoryView } from "../../view/ui/HtmlInventoryView";
import { PlayerInventory } from "../inventory/playerInventory";
import { LocalCLientPlayer } from "../player/players/localClientPlayer";
import { HtmlMoneyView } from "../../view/ui/HtmlMoneyView";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: Scene,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<Player>,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private mapManager: MapManager,
    private collisionManager: CollisionManager
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
          this.collisionableTargetRepository.remove(player.view.id);
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
      this.collisionableTargetRepository
    );
    const view = new ClientPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      info.name,
      false,
      collisionResolver
    );
    this.collisionManager.addPlayer(view);

    const player = new Player(info, state, view, DefaultPlayerStats);
    view.setEntityReference(player);
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
      this.collisionableTargetRepository
    );

    const view = new ClientPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      info.name,
      true,
      collisionResolver
    );

    this.collisionManager.addPlayer(view);

    const input = new PlayerKeyBoardInput(this.scene.input.keyboard);

    const movementSystem = new PlayerMovement();

    const moneyView = new HtmlMoneyView();
    const player = new LocalCLientPlayer(
      info,
      state,
      view,
      stats ?? DefaultPlayerStats,
      movementSystem,
      input,
      new PlayerInventory(
        stats.inventorySize,
        new HtmlInventoryView(this.scene, input, moneyView),
        moneyView
      ),
      this.mapManager
    );
    view.setEntityReference(player);
    this.collisionableTargetRepository.save(view.id, {
      target: player,
      type: AttackTargetType.PLAYER,
    });

    this.presenterProvider.forInventory(player, view);
    this.presenterProvider.forLocalPlayer(input, player, view);

    this.inGamePlayersRepository.save(player.info.id, player);
  }
}
