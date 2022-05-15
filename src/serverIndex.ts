import { Socket } from "socket.io";
import * as Phaser from "phaser";

import { SocketIOEvents } from "./infrastructure/events/socketIoEvents";
import { ServerProvider } from "./infrastructure/providers/serverProvider";
import { GameScene } from "./view/scenes/GameScene";
import { SocketClientConnection } from "./infrastructure/socketClientConnection";
import { PhaserServerConfig } from "./infrastructure/configuration/PhaserGameConfigs";
import { LoadScene } from "./view/scenes/LoadScene";
import { Log } from "./infrastructure/Logger";
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
import { ServerEnemyCreatorDelegator } from "./domain/enemies/serverEnemyCreatorDelegator";
import { EnemiesStateSenderDelegator } from "./domain/gameState/enemiesStateSenderDelegator";

export const InitGame: (socket: Socket, originUrl: string, provider: ServerProvider) => void = (
  socket: Socket,
  originUrl: string,
  provider
) => {
  const scene = new GameScene();
  const config = {
    ...PhaserServerConfig,
    scene: [new LoadScene(), scene],
  };

  const game = new Phaser.Game(config);
  AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);
  game.events.addListener(Phaser.Core.Events.READY, async () => {
    await LoadServerRepositoriesWithMockData(provider);

    scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      const __ = new ScenePresenter(scene, [
        new CompleteMapDelegator(
          provider.mapMapanger,
          scene,
          provider.roomManager,
          socket,
          provider.environmentObjectsRepository,
          provider.presenterProvider,
          provider.inGamePlayerRepository
        ),
        new ServerEnemyCreatorDelegator(
          scene,
          provider.enemiesRepository,
          provider.roomManager,
          provider.presenterProvider
        ),
        new PlayerStateDelegator(
          provider.roomManager,
          provider.inGamePlayerRepository,
          socket
        ),
        new EnemiesStateSenderDelegator(
          provider.roomManager,
          socket,
          provider.enemiesRepository
        ),
        new ServerPlayerCreatorDelegator(
          provider.connectionsRepository,
          scene,
          socket,
          provider.roomManager,
          provider.playerInfoRepository,
          provider.playerStateRepository,
          provider.inventoryRepository,
          provider.presenterProvider,
          provider.inGamePlayerRepository,
          provider.playerStatsRepository,
          provider.attackTargetRepository,
          provider.mapMapanger,
          provider.playerInputRequestRepository
        ),
        new ServerPlayerInventoryDelegator(
          provider.inventoryRepository,
          provider.itemsRepository,
          provider.inGamePlayerRepository
        ),
        new EnvironmentObjectDetailsDispatcherDelegator(
          provider.environmentObjectsRepository,
          provider.connectionsRepository
        ),
      ]);
      socket.on(SocketIOEvents.CONNECTION, (clientSocket: Socket) => {
        const connection = new SocketClientConnection(clientSocket);
        provider.connectionsRepository.save(
          connection.connectionId,
          connection
        );
        Log(
          "InitServerGame",
          `[Event: ${SocketIOEvents.CONNECTION}] :: with connection id: ${clientSocket.id}`
        );
        clientSocket.on(SocketIOEvents.DISCONNECT, () => {
          provider.connectionsRepository.remove(connection.connectionId);
          Log(
            "InitServerGame",
            `[Event: ${SocketIOEvents.DISCONNECT}] :: with connection id: ${clientSocket.id}`
          );
        });
      });
    });
  });
};

export const InitServerDependencies = () => {
  return new ServerProvider(MapsConfiguration);
  
}

export const InitGameStateSender = (socket: Socket, dependencyProvider: ServerProvider) => {
  const del = new EnemiesStateSenderDelegator(
    dependencyProvider.roomManager,
    socket,
    dependencyProvider.enemiesRepository
  );
  del.init()
  setInterval(() => {
    del.update(1,1)
  }, 16);
};
