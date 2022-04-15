import { ClientProvider } from "./clientProvider";
import { PlayerInput } from "../../domain/player/playerInput";
import { ActionProvider } from "./actionProvider";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { PlayerMovementValidationDelegator } from "../../domain/movement/playerMovementValidationDelegator";
import { PlayerInputDelegator } from "../../domain/input/playerInputDelegator";
import { LocalPlayerRenderDelegator } from "../../domain/player/localPlayerRenderDelegator";
import { PlayerRemoteMovementDelegator } from "../../domain/movement/playerRemoteMovementDelegator";
import { PlayerAnimationDelegator } from "../../domain/animations/playerAnimationDelegator";
import { RemotePlayerAnimationDelegator } from "../../domain/animations/remotePlayerAnimationDelegator";
import { CurrentMapDelegator } from "../../domain/environment/currentMapDelegator";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { ClientPlayer } from "../../domain/player/localPlayer";
import { PlayerInfoDelegator } from "../../domain/player/playerInfoDelegator";
import { BackgroundDelegator } from "../../domain/environment/backgroundDelegator";
import { ClientPlayerInventoryDelegator } from "../../domain/items/clientPlayerInventoryDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ClientConnectionDelegator } from "../../domain/gameState/clientConnectionDelegator";
import { ScenePresenter } from "../../presentation/scenePresenter";
import { ClientPlayerConnectionDelegator } from "../../domain/player/clientPlayerConnectionDelegator";
import { PlayerAngleFixDelegator } from "../../domain/movement/playerAngleFixDelegator";
import { ClientInventoryView } from "../../view/clientInventoryView";
import { PlayerInfo } from "../../domain/player/playerInfo";
export class ClientPresenterProvider {
  forLocalPlayer(input: PlayerInput, player: ClientPlayer): void {
    new ViewPresenter(player.view, [
      new PlayerCollisionDelegator(
        player,
        ClientProvider.playerStateRepository
      ),
      new PlayerMovementValidationDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.playerStateRepository,
        ClientProvider.playerInputRequestRepository,
        input
      ),
      new PlayerInputDelegator(
        player,
        input,
        ClientProvider.serverConnection,
        ClientProvider.playerStateRepository,
        ActionProvider.ResolvePlayerMovementWithInputs,
        ClientProvider.playerInputRequestRepository
      ),
      new LocalPlayerRenderDelegator(player),
      new PlayerAnimationDelegator(
        player,
        ClientProvider.playerStateRepository
      ),
      new PlayerInfoDelegator(player),
      new ClientPlayerConnectionDelegator(
        ClientProvider.serverConnection,
        player
      ),
      new PlayerAngleFixDelegator(player),
    ]);
  }
  forPlayer(player: ClientPlayer): void {
    new ViewPresenter(player.view, [
      new RemotePlayerAnimationDelegator(
        player,
        ClientProvider.playerStateRepository
      ),
      new PlayerRemoteMovementDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.playerStateRepository
      ),
      new PlayerInfoDelegator(player),
      new ClientPlayerConnectionDelegator(
        ClientProvider.serverConnection,
        player
      ),
      new PlayerAngleFixDelegator(player),
    ]);
  }

  forGameplay(scene: ClientGameScene): void {
    new ScenePresenter(scene, [
      new CurrentMapDelegator(
        scene,
        ClientProvider.serverConnection,
        ClientProvider.originUrl,
        ClientProvider.environmentObjectRepository
      ),
      new BackgroundDelegator(
        scene,
        ClientProvider.serverConnection,
        ClientProvider.localPlayerRepository,
        ClientProvider.connectedPlayers
      ),
      new ClientConnectionDelegator(
        ClientProvider.localPlayerRepository.playerId,
        ClientProvider.serverConnection,
        scene,
        ActionProvider.CreateClientPlayer,
        ActionProvider.CreateLocalClientPlayer,
        ClientProvider.connectedPlayers
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
}
