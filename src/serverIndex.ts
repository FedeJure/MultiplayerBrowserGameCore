import * as Phaser from "phaser";
import { Socket } from "socket.io";
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
import { ServerPlayerInventoryDelegator } from "./domain/inventory/serverPlayerInventoryDelegator";
import { ScenePresenter } from "./presentation/scenePresenter";
import { AssetLoader } from "./view/AssetLoader";
import { AssetsConfiguration } from "./infrastructure/configuration/AssetsConfiguration";
import { LoadServerRepositoriesWithMockData } from "./infrastructure/mockUtils";
import { EnvironmentObjectDetailsDispatcherDelegator } from "./domain/environmentObjects/environmentObjectDetailsDispatcherDelegator";
import { EnemiesStateSenderDelegator } from "./domain/gameState/enemiesStateSenderDelegator";
import { PhaserCollisionManager } from "./view/collisions/phaserCollisionManager";
import { LootUpdaterDelegator } from "./domain/loot/lootUpdaterDelegator";
import { ServerLootClaimerDelegator } from "./domain/loot/serverLootClaimerDelegator";
import { DBConfiguration } from "./infrastructure/DBConfiguration";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Account } from "./domain/account/account";
import { ServerEnemyCreatorDelegator } from "./domain/enemies/serverEnemyCreatorDelegator";

class ServerApi {
  constructor(private provider: ServerProvider) {}

  public async loginUser(email: string, password: string) {
    return new Promise((res) => {
      this.provider.accountRepository.getBy({ email }).then(async (account) => {
        if (!account) {
          res({ success: false, message: "Account not found" });
          return;
        }
        const existingPlayers = await this.provider.playerInfoRepository.getAll(
          { accountId: account.id }
        );

        bcrypt.compare(
          password,
          account.hashedPassword,
          function (err, result) {
            if (result && !err)
              res({
                success: true,
                message: "Happy gaming!",
                players: existingPlayers,
              });
            else res({ success: false, message: "Wrong password" });
          }
        );
      });
    });
  }

  public async createAccount(email: string, password: string) {
    return new Promise((res) => {
      bcrypt.hash(password, 10, async (err, hash: string) => {
        if (err) res({ success: false, message: "Error creating account" });
        else {
          const account: Account = {
            id: this.provider.accountRepository.getId(),
            email,
            hashedPassword: hash,
            creationDate: Date.now(),
          };
          await this.provider.accountRepository.save(account.id, account);
          const playerId = this.provider.playerInfoRepository.getId();
          await this.provider.playerInfoRepository.save(playerId, {
            id: playerId,
            name: email,
            accountId: account.id,
          });
          res({ success: true, message: "Account created!" });
        }
      });
    });
  }
}

export const InitGame: (
  socket: Socket,
  originUrl: string
) => Promise<ServerApi> = async (socket, originUrl) => {
  return new Promise((res, err) => {
    const provider = InitServerDependencies();
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    let mongod;
    (async () => {
      // const mongod = await MongoMemoryServer.create({
      //   instance: {
      //     dbName: DBConfiguration.dbName,
      //     port: DBConfiguration.port
      //   },
      // });
      // await mongoose.connect("mongodb://localhost:27017", {
      //   dbName: DBConfiguration.dbName
      // });
      await mongoose.connect("mongodb://localhost:27017", {
        dbName: DBConfiguration.dbName,
      });
    })();

    const scene = new GameScene();
    const config = {
      ...PhaserServerConfig,
      scene: [new LoadScene(), scene],
    };

    const game = new Phaser.Game(config);
    AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);

    game.events.addListener(Phaser.Core.Events.DESTROY, async () => {
      // await mongod.stop();
      await mongoose.disconnect();
    });

    game.events.addListener(Phaser.Core.Events.READY, async () => {
      provider.setCollisionManager(new PhaserCollisionManager(scene));
      scene.events.addListener(Phaser.Scenes.Events.CREATE, async () => {
        await LoadServerRepositoriesWithMockData(provider);
        const __ = new ScenePresenter(scene, [
          new CompleteMapDelegator(
            provider.mapMapanger,
            scene,
            provider.roomManager,
            socket,
            provider.environmentObjectsRepository,
            provider.presenterProvider,
            provider.inGamePlayerRepository,
            provider.collisionManager,
            provider.lootRepository,
            provider.enemiesRepository,
            provider.collisionableTargetRepository,
            provider.lootConfigurationRepository,
            provider.lootGenerator,
            provider.enemiesModelRepository,
            provider.playerRoomChangeEventRepository
          ),
          new ServerEnemyCreatorDelegator(
            scene,
            provider.enemiesRepository,
            provider.roomManager,
            provider.presenterProvider,
            provider.collisionableTargetRepository,
            provider.collisionManager,
            provider.lootConfigurationRepository,
            provider.lootGenerator,
            provider.mapMapanger,
            provider.enemiesModelRepository
          ),
          // new PlayerStateDelegator( Trying send states from another service
          //   provider.roomManager,
          //   provider.inGamePlayerRepository,
          //   socket,
          //   provider.playerInputRequestRepository
          // ),
          new LootUpdaterDelegator(socket, provider.lootRepository),
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
            provider.collisionableTargetRepository,
            provider.mapMapanger,
            provider.playerInputRequestRepository,
            provider.collisionManager,
            provider.playerBalanceRepository,
            provider.playerRoomChangeEventRepository
          ),
          new ServerPlayerInventoryDelegator(
            provider.itemsRepository,
            provider.inGamePlayerRepository
          ),
          new EnvironmentObjectDetailsDispatcherDelegator(
            provider.environmentObjectsRepository,
            provider.connectionsRepository
          ),
          new ServerLootClaimerDelegator(
            provider.lootRepository,
            provider.inGamePlayerRepository,
            provider.itemsRepository
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
        res(new ServerApi(provider));
      });
    });
  });
};

const InitServerDependencies = () => {
  return new ServerProvider(MapsConfiguration, false);
};

export const InitGameStateSender = (
  socket: Socket,
  dependencyProvider: ServerProvider
) => {
  const del = new EnemiesStateSenderDelegator(
    dependencyProvider.roomManager,
    socket,
    dependencyProvider.enemiesRepository
  );
  del.init();
  setInterval(() => {
    del.update(1, 1);
  }, 16);
};
