import { Socket } from "socket.io";
import * as Phaser from "phaser";

import { SocketIOEvents } from "./infrastructure/events/socketIoEvents";
import { ServerProvider } from "./infrastructure/providers/serverProvider";
import { ClientProvider } from "./infrastructure/providers/clientProvider";
import { GameScene } from "./view/scenes/GameScene";
import { SocketClientConnection } from "./infrastructure/socketClientConnection";
import {
  PhaserClientConfig,
  PhaserServerConfig,
} from "./infrastructure/configuration/PhaserGameConfigs";
import { LoadScene } from "./view/scenes/LoadScene";
import { SocketServerConnection } from "./infrastructure/socketServerConnection";
import { Log } from "./infrastructure/Logger";
import { GameplayHud } from "./view/scenes/GameplayHud";
import { LocalPlayerRepository } from "./infrastructure/repositories/localPlayerRepository";
import { ClientLoadScene } from "./view/scenes/ClientLoadScene";
import { ClientGameScene } from "./view/scenes/ClientGameScene";
import { CompleteMapDelegator } from "./domain/environment/completeMapDelegator";
import { MapsConfiguration } from "./infrastructure/configuration/MapsConfiguration";
import { PlayerStateDelegator } from "./domain/gameState/playerStateDelegator";
import { ServerPlayerCreatorDelegator } from "./domain/player/serverPlayerCreatorDelegator";
import { ServerPlayerInventoryDelegator } from "./domain/items/serverPlayerInventoryDelegator";
import { ScenePresenter } from "./presentation/scenePresenter";
import { AssetLoader } from "./view/AssetLoader";
import { AssetsConfiguration } from "./infrastructure/configuration/AssetsConfiguration";
import { LoadServerRepositoriesWithMockData } from "./infrastructure/mockUtils";
import { EnvironmentObjectDetailsDispatcherDelegator } from "./domain/environmentObjects/environmentObjectDetailsDispatcherDelegator";

export const InitGame: (socket: Socket, originUrl: string) => void = (
  socket: Socket,
  originUrl: string
) => {
  const scene = new GameScene();
  const config = {
    ...PhaserServerConfig,
    scene: [new LoadScene(), scene],
  };
  const game = new Phaser.Game(config);
  AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);
  game.events.addListener(Phaser.Core.Events.READY, async () => {
    await LoadServerRepositoriesWithMockData();

    scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      const __ = new ScenePresenter(scene, [
        new CompleteMapDelegator(
          MapsConfiguration,
          scene,
          ServerProvider.roomManager,
          socket,
          ServerProvider.environmentObjectsRepository,
          ServerProvider.presenterProvider,
          ServerProvider.inGamePlayerRepository
        ),
        new PlayerStateDelegator(
          ServerProvider.roomManager,
          ServerProvider.inGamePlayerRepository,
          socket
        ),
        new ServerPlayerCreatorDelegator(
          ServerProvider.connectionsRepository,
          scene,
          socket,
          ServerProvider.roomManager,
          ServerProvider.playerInfoRepository,
          ServerProvider.playerStateRepository,
          ServerProvider.inventoryRepository,
          ServerProvider.presenterProvider,
          ServerProvider.inGamePlayerRepository,
          ServerProvider.playerStatsRepository
        ),
        new ServerPlayerInventoryDelegator(
          ServerProvider.inventoryRepository,
          ServerProvider.itemsRepository,
          ServerProvider.inGamePlayerRepository
        ),
        new EnvironmentObjectDetailsDispatcherDelegator(
          ServerProvider.environmentObjectsRepository,
          ServerProvider.connectionsRepository
        ),
      ]);
      socket.on(SocketIOEvents.CONNECTION, (clientSocket: Socket) => {
        const connection = new SocketClientConnection(clientSocket);
        ServerProvider.connectionsRepository.save(
          connection.connectionId,
          connection
        );
        Log(
          "InitServerGame",
          `[Event: ${SocketIOEvents.CONNECTION}] :: with connection id: ${clientSocket.id}`
        );
        clientSocket.on(SocketIOEvents.DISCONNECT, () => {
          ServerProvider.connectionsRepository.remove(connection.connectionId);
          Log(
            "InitServerGame",
            `[Event: ${SocketIOEvents.DISCONNECT}] :: with connection id: ${clientSocket.id}`
          );
        });
      });
    });
  });
};

export const InitClientGame = (
  socket: any,
  localPlayerId: string,
  originUrl: string
) => {
  const connectionWithServer = new SocketServerConnection(socket);
  const hudScene = new GameplayHud(connectionWithServer);

  ClientProvider.Init(
    connectionWithServer,
    new LocalPlayerRepository(localPlayerId),
    originUrl,
    hudScene
  );
  const scene = new ClientGameScene(hudScene);
  const config = {
    ...PhaserClientConfig,
    scene: [new ClientLoadScene(), scene, hudScene],
  };
  const game = new Phaser.Game(config);
  AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);

  game.events.addListener(Phaser.Core.Events.READY, () => {
    ClientProvider.presenterProvider.forGameplay(scene);
  });
};
