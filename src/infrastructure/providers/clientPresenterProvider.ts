import { ClientProvider } from "./clientProvider";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerMovementValidationDelegator } from "../../domain/player/movement/playerMovementValidationDelegator";
import { PlayerInputDelegator } from "../../domain/input/playerInputDelegator";
import { LocalPlayerRenderDelegator } from "../../domain/player/localPlayerRenderDelegator";
import { PlayerRemoteMovementDelegator } from "../../domain/player/movement/playerRemoteMovementDelegator";
import { CurrentMapDelegator } from "../../domain/environment/currentMapDelegator";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { BackgroundDelegator } from "../../domain/environment/backgroundDelegator";
import { ClientPlayerInventoryDelegator } from "../../domain/items/clientPlayerInventoryDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ClientConnectionDelegator } from "../../domain/gameState/clientConnectionDelegator";
import { ScenePresenter } from "../../presentation/scenePresenter";
import { ClientPlayerConnectionDelegator } from "../../domain/player/clientPlayerConnectionDelegator";
import { ClientInventoryView } from "../../view/clientInventoryView";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { Delegator } from "../../domain/delegator";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { GameObjects } from "phaser";
import { PlayerStateUpdaterDelegator } from "../../domain/player/playerStateUpdaterDelegator";
import { ClientEnemyCreatorDelegator } from "../../domain/enemies/clientEnemyCreatorDelegator";
import { EnemyUpdateDelegator } from "../../domain/enemies/enemyUpdateDelegator";
import { ControllablePlayer } from "../../domain/player/players/controllablePlayer";
import { Player } from "../../domain/player/players/player";
import { Enemy } from "../../domain/enemies/enemy";

export class ClientPresenterProvider {
  forLocalPlayer(
    input: PlayerInput,
    player: ControllablePlayer,
    view: GameObjects.GameObject
  ): void {
    new ViewPresenter(view, [
      new PlayerMovementValidationDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.playerInputRequestRepository
      ),
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
        scene,
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
        ClientProvider.collisionManager
      ),
      new ClientEnemyCreatorDelegator(
        scene,
        ClientProvider.serverConnection,
        ClientProvider.spawnedEnemies,
        ClientProvider.presenterProvider
      ),
    ]);
  }
  forInventory(playerId: PlayerInfo["id"], view: ClientInventoryView) {
    new ViewPresenter(view, [
      new ClientPlayerInventoryDelegator(
        playerId,
        ClientProvider.inventoryRepository,
        ClientProvider.serverConnection,
        ClientProvider.itemsRepository,
        view
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
