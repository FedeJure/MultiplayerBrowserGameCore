import MockSocket from "socket.io-mock";
import { InMemoryPlayerStateRepository } from "../../infrastructure/repositories/inMemoryPlayerStateRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { SocketRoomManager } from "../../infrastructure/SocketRoomManager";
import { SocketClientConnection } from "../../infrastructure/socketClientConnection";
import { ProcessedMap } from "../../domain/environment/processedMap";

let playerStates: PlayerStateRepository = new InMemoryPlayerStateRepository();
let roomManager: SocketRoomManager = new SocketRoomManager(playerStates);
let socket: MockSocket = new MockSocket();

let defaultMap: ProcessedMap = {
  config: {
    id: 1,
    backgroundFile: [],
    jsonFile: { key: "string", fileName: "string" },
    tilesSourceFiles: { key: "string", fileName: "string" },
    objectsSourceFile: { key: "string", fileName: "string" },
  },
  layerId: 1,
  id: 1,
  originX: 0,
  originY: 0,
  height: 10,
  width: 10,
  leftMapId: undefined,
  rightMapId: undefined,
  topMapId: undefined,
  bottomMapId: undefined,
  leftTopMapId: undefined,
  rightTopMapId: undefined,
  leftBottomMapId: undefined,
  rightBottomMapId: undefined,
};

let maps: ProcessedMap[] = [
  {
    ...defaultMap,
    config: {
      ...defaultMap.config,
      id: 1,
    },
    id: 1,
  },
];

let maps1: ProcessedMap[] = [
  {
    ...defaultMap,
    config: {
      ...defaultMap.config,
      id: 2,
    },
    id: 2,
  },
];

beforeEach(() => {
  playerStates = new InMemoryPlayerStateRepository();
  roomManager = new SocketRoomManager(playerStates);
});

test("Get players by room empty when no players added", () => {
  const players = roomManager.getPlayersByRoom();
  expect(Object.keys(players).length).toEqual(0);
});

test("Get one player after added on some channel", async () => {
  await roomManager.joinToRoom(
    "anId",
    new SocketClientConnection(socket),
    maps
  );
  const players = roomManager.getPlayersByRoom();
  expect(Object.keys(players).length).toEqual(1);
});

test("Get one player after added on some channel and switch to another", async () => {
  const clientConnection = new SocketClientConnection(socket);
  await roomManager.joinToRoom("anId", clientConnection, maps);

  await roomManager.joinToRoom("anId", clientConnection, maps1);
  const players = roomManager.getPlayersByRoom();
  expect(Object.keys(players).length).toEqual(1);
});

test("Join player to many rooms", async () => {
  const clientConnection = new SocketClientConnection(socket);
  await roomManager.joinToRoom("anId", clientConnection, [
    {
      ...defaultMap,
      id: 1,
    },
    {
      ...defaultMap,
      id: 2,
    },
    {
      ...defaultMap,
      id: 3,
    },
    {
      ...defaultMap,
      id: 4,
    },
    {
      ...defaultMap,
      id: 5,
    },
  ]);

  const players = roomManager.getPlayersByRoom();
  expect(Object.keys(players).length).toEqual(5);
});


test("Remove one room from player who joined to many rooms", async () => {
    const clientConnection = new SocketClientConnection(socket);
    await roomManager.joinToRoom("anId", clientConnection, [
      {
        ...defaultMap,
        id: 1,
      },
      {
        ...defaultMap,
        id: 2,
      },
      {
        ...defaultMap,
        id: 3,
      },
      {
        ...defaultMap,
        id: 4,
      },
      {
        ...defaultMap,
        id: 5,
      },
    ]);

    await roomManager.joinToRoom("anId", clientConnection, [
        {
          ...defaultMap,
          id: 1,
        },
        {
          ...defaultMap,
          id: 2,
        },
        {
          ...defaultMap,
          id: 4,
        },
        {
          ...defaultMap,
          id: 5,
        },
      ]);
  
    const players = roomManager.getPlayersByRoom();
    expect(Object.keys(players).length).toEqual(4);
  });
