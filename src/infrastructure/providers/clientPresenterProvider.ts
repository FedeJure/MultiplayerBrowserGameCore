import { ClientProvider } from "./clientProvider";
import { PlayerInput } from "../../domain/player/playerInput";
import { ClientPlayerPresenter } from "../../presentation/clientPlayerPresenter";
import { GameScene } from "../../view/scenes/GameScene";
import { ClientGamePresenter } from "../../presentation/clientGamePresenter";
import { ActionProvider } from "./actionProvider";
import { Player } from "../../domain/player/player";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { PlayerMovementValidationDelegator } from "../../domain/movement/playerMovementValidationDelegator";
import { PlayerInputDelegator } from "../../domain/input/playerInputDelegator";
import { LocalPlayerRenderDelegator } from "../../domain/player/localPlayerRenderDelegator";
import { PlayerRemoteMovementDelegator } from "../../domain/movement/playerRemoteMovementDelegator";
import { PlayerAnimationDelegator } from "../../domain/animations/playerAnimationDelegator";
import { RemotePlayerAnimationDelegator } from "../../domain/animations/remotePlayerAnimationDelegator";
import { CurrentMapDelegator } from "../../domain/environment/currentMapDelegator";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
export class ClientPresenterProvider {
  forLocalPlayer(input: PlayerInput, player: Player): void {
    new ClientPlayerPresenter(ClientProvider.serverConnection, player, [
      new PlayerCollisionDelegator(
        player,
        ClientProvider.collisionsDispatcher,
        ClientProvider.playerStateRepository
      ),
      new PlayerMovementValidationDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.playerStateRepository,
        ClientProvider.playerInputRequestRepository
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
    ]);
  }
  forPlayer(player: Player): void {
    new ClientPlayerPresenter(ClientProvider.serverConnection, player, [
      // new PlayerMovementValidationDelegator(
      //   player,
      //   ClientProvider.serverConnection,
      //   ClientProvider.playerStateRepository,
      //   ClientProvider.playerInputRequestRepository
      // ),
      new RemotePlayerAnimationDelegator(
        player,
        ClientProvider.playerStateRepository
      ),
      new PlayerRemoteMovementDelegator(
        player,
        ClientProvider.serverConnection,
        ClientProvider.playerStateRepository
      ),
    ]);
  }

  forGameplay(scene: ClientGameScene): void {
    new ClientGamePresenter(
      ClientProvider.localPlayerRepository.playerId,
      ClientProvider.serverConnection,
      scene,
      ActionProvider.CreateClientPlayer,
      ActionProvider.CreateLocalClientPlayer,
      ClientProvider.connectedPlayers,
      [
        new CurrentMapDelegator(
          scene,
          ClientProvider.localPlayerRepository.playerId,
          ClientProvider.serverConnection,
          ClientProvider.playerStateRepository
        ),
      ]
    );
  }
}
