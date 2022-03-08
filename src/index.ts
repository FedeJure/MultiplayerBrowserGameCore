import { Socket } from "socket.io";
import * as Phaser from "phaser";

import { ServerGamePresenter } from "./presentation/serverGamePresenter";
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
import { ActionProvider } from "./infrastructure/providers/actionProvider";
import { ClientLoadScene } from "./view/scenes/ClientLoadScene";
import { ClientGameScene } from "./view/scenes/ClientGameScene";
import { CompleteMapDelegator } from "./domain/environment/completeMapDelegator";
import { MapsConfiguration } from "./infrastructure/configuration/MapsConfiguration";
import { PlayerStateDelegator } from "./domain/gameState/playerStateDelegator";

export const InitGame: (socket: Socket, originUrl: string) => void = (
  socket: Socket,
  originUrl: string
) => {
  const scene = new GameScene(ServerProvider.collisionsDispatcher);
  const config = {
    ...PhaserServerConfig,
    scene: [new LoadScene(originUrl), scene],
  };
  const _ = new Phaser.Game(config);

  for (let i = 1; i <= 200; i++) {
    ServerProvider.playerInfoRepository.addPlayer(i.toString(), {
      id: i.toString(),
      name: "Test Player " + i,
    });
    // ServerProvider.playerStateRepository.setPlayerState(
    //   i.toString(),
    //   DefaultPlayerState
    // );
  }

  // const room = new SocketRoomConnection(socket, "main");
  const __ = new ServerGamePresenter(
    scene,
    socket,
    ActionProvider.CreatePlayerFromId,
    ServerProvider.connectionsRepository,
    ServerProvider.connectedPlayerRepository,
    [
      new CompleteMapDelegator(
        MapsConfiguration,
        ServerProvider.playerStateRepository,
        ServerProvider.connectionsRepository,
        ServerProvider.playerConnectionsRepository,
        scene,
        originUrl,
        ServerProvider.roomManager
      ),
      new PlayerStateDelegator(
        ServerProvider.roomManager,
        ServerProvider.playerStateRepository,
        socket
      ),
    ],
    ServerProvider.playerConnectionsRepository,
    ServerProvider.roomManager
  );
  socket.on(SocketIOEvents.CONNECTION, (clientSocket: Socket) => {
    // const emitFn = clientSocket.emit;

    // clientSocket.emit = function (...args: [ev: string, ...args: any[]]) {
    //   setTimeout(() => {
    //     return emitFn.apply(clientSocket, args);
    //   }, 500);
    //   emitFn.apply(clientSocket, args)
    //   return true;
    // };
    const connection = new SocketClientConnection(clientSocket);
    // room.join(connection);
    ServerProvider.connectionsRepository.addConnection(connection);
    Log(
      "InitServerGame",
      `[Event: ${SocketIOEvents.CONNECTION}] :: with connection id: ${clientSocket.id}`
    );

    clientSocket.on(SocketIOEvents.DISCONNECT, () => {
      ServerProvider.connectionsRepository.removeConnection(
        connection.connectionId
      );
      Log(
        "InitServerGame",
        `[Event: ${SocketIOEvents.DISCONNECT}] :: with connection id: ${clientSocket.id}`
      );
    });
  });
};

export const InitClientGame = (
  socket: any,
  localPlayerId: string,
  originUrl: string
) => {
  const connectionWithServer = new SocketServerConnection(socket);
  ClientProvider.Init(
    connectionWithServer,
    new LocalPlayerRepository(localPlayerId),
    originUrl
  );
  const scene = new ClientGameScene(ClientProvider.collisionsDispatcher);
  const config = {
    ...PhaserClientConfig,
    scene: [
      new ClientLoadScene(originUrl),
      scene,
      new GameplayHud(connectionWithServer),
    ],
  };
  new Phaser.Game(config);
  ClientProvider.presenterProvider.forGameplay(scene);
};
