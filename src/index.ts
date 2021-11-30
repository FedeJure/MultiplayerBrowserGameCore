import { Socket } from "socket.io";
import { ServerGamePresenter } from "./presentation/serverGamePresenter";
import { SocketIOEvents } from "./infrastructure/events/socketIoEvents";
import { ServerProvider } from "./infrastructure/providers/serverProvider";
import { ClientProvider } from "./infrastructure/providers/clientProvider";
import { GameScene } from "./view/scenes/GameScene";
import { SocketClientConnection } from "./infrastructure/socketClientConnection";
import {
  ClientConfig,
  ServerConfig,
} from "./infrastructure/configuration/DefaultGameConfigs";
import { LoadScene } from "./view/scenes/LoadScene";
import { SocketServerConnection } from "./infrastructure/socketServerConnection";
import { SocketRoomConnection } from "./infrastructure/socketRoomConnection";
import { Log } from "./infrastructure/Logger";
import { GameplayHud } from "./view/scenes/GameplayHud";
import { LocalPlayerRepository } from "./infrastructure/repositories/localPlayerRepository";
import { ActionProvider } from "./infrastructure/providers/actionProvider";
import { DefaultPlayerState } from "./infrastructure/configuration/DefaultPlayerState";
import * as Phaser from "phaser"

export const InitGame: (socket: Socket) => void = (socket: Socket) => {
  const scene = new GameScene(ServerProvider.collisionsDispatcher);
  const config = { ...ServerConfig, scene: scene };
  const _ = new Phaser.Game(config);

  for (let i = 1; i <= 200; i++) {
    ServerProvider.playerInfoRepository.addPlayer(i.toString(), {
      id: i.toString(),
      name: "Test Player "+ i,
    });
    ServerProvider.playerStateRepository.setPlayerState(i.toString(), DefaultPlayerState);
  }

  const room = new SocketRoomConnection(socket, "main");
  const __ = new ServerGamePresenter(
    scene,
    room,
    ActionProvider.CreatePlayerFromId,
    ServerProvider.connectionsRepository,
    ServerProvider.connectedPlayerRepository,
    ServerProvider.playerStateRepository
  );
  socket.on(SocketIOEvents.CONNECTION, (clientSocket: Socket) => {
    const emitFn = clientSocket.emit;
    clientSocket.emit = function (...args: [ev: string, ...args: any[]]) {
      setTimeout(() => {
        return emitFn.apply(clientSocket, args);
      }, 500);
      return true;
    };
    const connection = new SocketClientConnection(clientSocket);
    room.join(connection);
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

export const InitClientGame = (socket: any, localPlayerId: string, originUrl: string) => {
  const connectionWithServer = new SocketServerConnection(socket);
  ClientProvider.Init(
    connectionWithServer,
    new LocalPlayerRepository(localPlayerId)
  );
  const scene = new GameScene(ClientProvider.collisionsDispatcher);
  const config = {
    ...ClientConfig,
    scene: [new LoadScene(originUrl), scene, new GameplayHud(connectionWithServer)],
  };
  new Phaser.Game(config);
  ClientProvider.presenterProvider.forGameplay(scene);
};
