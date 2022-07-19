import { PlayerKeyBoardInput } from "../../infrastructure/input/playerKeyboardInput";
import { Log } from "../../infrastructure/Logger";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { Delegator } from "../delegator";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { ServerConnection } from "../serverConnection";
import { PlayerState } from "../player/playerState";
import { PlayerInfo } from "../player/playerInfo";
import { SimpleRepository } from "../repository";
import { Scene } from "phaser";
import { Player } from "../player/players/player";
import { DefaultPlayerStats, PlayerStats } from "../player/playerStats";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { CollisionableTargetType } from "../combat/attackTargetType";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { MapManager } from "../environment/mapManager";
import { CollisionManager } from "../collisions/collisionManager";
import { HtmlInventoryView } from "../../view/ui/HtmlInventoryView";
import { ClientInventory } from "../inventory/playerInventory";
import { LocalClientPlayer } from "../player/players/localClientPlayer";
import { HtmlMoneyView } from "../../view/ui/HtmlMoneyView";
import { Balance } from "../inventory/balance";
import { ClientPlayerActionResolve } from "../player/clientPlayerActionResolver";
import { HtmlLootView } from "../../view/ui/HtmlLootView";
import { SceneNames } from "../../view/scenes/SceneNames";
import { ClientItemResolver } from "../items/clientItemResolver";
import { TransitionView } from "../../view/ui/TransitionView";
import { SpineLocalPlayerView } from "../../view/player/spineLocalPlayerView";
import { SpinePlayerView } from "../../view/player/spinePlayerView";
import { PlayerVirtualJoystickInput } from "../../infrastructure/input/playerVirtualJoystickInput";
import { isMobile } from "../../view/utils";
import { PlayerClientMovementValidator } from "../player/movement/clientPlayerMovementValidator";

export class ClientConnectionDelegator implements Delegator {
  constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private scene: Scene,
    private presenterProvider: ClientPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<Player>,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private mapManager: MapManager,
    private collisionManager: CollisionManager,
    private itemResolver: ClientItemResolver
  ) {}
  init(): void {
    this.connection.onInitialGameState.subscribe(async (data) => {
      this.mapManager.onMapReady.subscribe((mapId) => {
        if (mapId !== data.currentMap?.id) return;
        Log(this, "Initial Game State Event", data);
        this.createLocalClientPlayer(
          data.localPlayer.state,
          data.localPlayer.info,
          data.localPlayer.stats
        );
        this.createClientPlayer(data.localPlayer.state, data.localPlayer.info)
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
    });

    this.scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      this.connection
        .emitStartNewConnection(this.localPlayerId)
        .then(({ success, message }) => {
          if (!success) {
            alert(`Connecting error! | ${message}`);
            location.reload();
          }
        });
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
    const view = new SpinePlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      info.name,
      "hero",
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

    const view = new SpineLocalPlayerView(
      this.scene,
      state.position.x,
      state.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      info.name,
      "hero",
      collisionResolver
    );

    this.collisionManager.addPlayer(view);

    const input = isMobile()
      ? new PlayerVirtualJoystickInput(
          this.scene.scene.get(SceneNames.ClientHudScene)
        )
      : new PlayerKeyBoardInput(this.scene.input.keyboard);
    const movementSystem = new PlayerClientMovementValidator(this.connection);

    const moneyView = new HtmlMoneyView();
    const player = new LocalClientPlayer(
      info,
      state,
      view,
      stats ?? DefaultPlayerStats,
      movementSystem,
      input,
      new ClientInventory(
        stats.inventorySize,
        new HtmlInventoryView(this.scene, input, moneyView)
      ),
      this.mapManager,
      new Balance(moneyView)
    );
    const lootView = new HtmlLootView(this.scene);
    this.scene.scene
      .get(SceneNames.ClientHudScene)
      .add.dom(
        this.scene.game.scale.width / 2,
        this.scene.game.scale.height / 2,
        lootView.element
      );
    new ClientPlayerActionResolve(
      player,
      this.connection,
      lootView,
      this.itemResolver
    );
    view.setEntityReference(player);
    this.collisionableTargetRepository.save(view.id, {
      target: player,
      type: CollisionableTargetType.PLAYER,
    });
    new TransitionView(this.scene).fadeIn();

    this.presenterProvider.forInventory(player, view);
    this.presenterProvider.forLocalPlayer(input, player, view);

    this.inGamePlayersRepository.save(player.info.id, player);
  }
}
