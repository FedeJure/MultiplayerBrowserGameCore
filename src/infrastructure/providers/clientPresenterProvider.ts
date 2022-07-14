import { ClientProvider } from "./clientProvider";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerMovementValidationDelegator } from "../../domain/player/movement/playerMovementValidationDelegator";
import { PlayerInputDelegator } from "../../domain/input/playerInputDelegator";
import { LocalPlayerRenderDelegator } from "../../domain/player/localPlayerRenderDelegator";
import { PlayerRemoteMovementDelegator } from "../../domain/player/movement/playerRemoteMovementDelegator";
import { CurrentMapDelegator } from "../../domain/environment/currentMapDelegator";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { BackgroundDelegator } from "../../domain/environment/backgroundDelegator";
import { ClientPlayerInventoryDelegator } from "../../domain/inventory/clientPlayerInventoryDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ClientConnectionDelegator } from "../../domain/gameState/clientConnectionDelegator";
import { ScenePresenter } from "../../presentation/scenePresenter";
import { ClientPlayerConnectionDelegator } from "../../domain/player/clientPlayerConnectionDelegator";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { Delegator } from "../../domain/delegator";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { GameObjects } from "phaser";
import { PlayerStateUpdaterDelegator } from "../../domain/player/playerStateUpdaterDelegator";
import { ClientEnemyCreatorDelegator } from "../../domain/enemies/clientEnemyCreatorDelegator";
import { EnemyUpdateDelegator } from "../../domain/enemies/enemyUpdateDelegator";
import { Player } from "../../domain/player/players/player";
import { Enemy } from "../../domain/enemies/enemy";
import { LocalClientPlayer } from "../../domain/player/players/localClientPlayer";
import { SceneNames } from "../../view/scenes/SceneNames";
import { ClientLootUpdaterDelegator } from "../../domain/loot/clientLootUpdaterDelegator";
import { PhaserClientLootCreatorView } from "../../view/loot/phaserClientLootCreatorView";

export class ClientPresenterProvider {
  forLocalPlayer(
    input: PlayerInput,
    player: LocalClientPlayer,
    view: GameObjects.GameObject
  ): void {
    new ViewPresenter(view, [
      // new PlayerMovementValidationDelegator(
      //   player,
      //   ClientProvider.serverConnection,
      //   ClientProvider.playerInputRequestRepository
      // ),
      new PlayerInputDelegator(
        player,
        input,
        ClientProvider.serverConnection,
        ClientProvider.playerInputRequestRepository
      ),
      new LocalPlayerRenderDelegator(player),
      new ClientPlayerConnectionDelegator(
        ClientProvider.serverConnection,
        player
      ),
      new PlayerStateUpdaterDelegator(player),
      new PlayerRemoteMovementDelegator(
        player,
        ClientProvider.serverConnection
      ),
      new ClientLootUpdaterDelegator(
        ClientProvider.serverConnection,
        new PhaserClientLootCreatorView(
          view.scene,
          ClientProvider.collisionManager
        )
      ),
    ]);
  }
  forPlayer(player: Player, view: GameObjects.GameObject): void {
    new ViewPresenter(view, [
      new PlayerRemoteMovementDelegator(
        player,
        ClientProvider.serverConnection
      ),
      new ClientPlayerConnectionDelegator(
        ClientProvider.serverConnection,
        player
      ),
      new PlayerStateUpdaterDelegator(player),
    ]);
  }

  forGameplay(scene: ClientGameScene): void {
    new ScenePresenter(scene, [
      new CurrentMapDelegator(
        scene,
        ClientProvider.serverConnection,
        ClientProvider.environmentObjectRepository,
        ClientProvider.mapManager,
        ClientProvider.collisionManager
      ),
      new BackgroundDelegator(
        scene.scene.get(SceneNames.BackgroundScene),
        ClientProvider.serverConnection,
        ClientProvider.localPlayerRepository,
        ClientProvider.inGamePlayersRepository
      ),
      new ClientConnectionDelegator(
        ClientProvider.localPlayerRepository.playerId,
        ClientProvider.serverConnection,
        scene,
        ClientProvider.presenterProvider,
        ClientProvider.inGamePlayersRepository,
        ClientProvider.collisionableTargetRepository,
        ClientProvider.mapManager,
        ClientProvider.collisionManager,
        ClientProvider.itemResolver
      ),
      new ClientEnemyCreatorDelegator(
        scene,
        ClientProvider.serverConnection,
        ClientProvider.spawnedEnemies,
        ClientProvider.presenterProvider
      ),
    ]);
  }
  forInventory(player: LocalClientPlayer, view: GameObjects.GameObject) {
    new ViewPresenter(view, [
      new ClientPlayerInventoryDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.itemResolver
      ),
    ]);
  }
  forEnvironmentObject(
    object: EnvironmentObject,
    view: GameObjects.GameObject
  ) {
    const delegators: Delegator[] = [];
    switch (object.objectVariant) {
      case EnvironmentObjectVariant.decorative:
        delegators.push(new AnimatedDecorativeObjectDelegator(view));
        break;
    }
    new ViewPresenter(view, delegators);
  }
  forEnemy(view: GameObjects.GameObject, enemy: Enemy) {
    new ViewPresenter(view, [new EnemyUpdateDelegator(enemy)]);
  }
}
