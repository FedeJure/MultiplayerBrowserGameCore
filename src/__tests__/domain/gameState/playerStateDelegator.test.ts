import MockSocket from "socket.io-mock";
import { PlayerStateDelegator } from "../../../domain/gameState/playerStateDelegator";
import { RoomManager } from "../../../domain/roomManager";
import { SocketRoomManager } from "../../../infrastructure/SocketRoomManager";
import { PlayerStateRepository } from "../../../infrastructure/repositories/playerStateRepository";
import { InMemoryPlayerStateRepository } from "../../../infrastructure/repositories/inMemoryPlayerStateRepository";
let roomManager: RoomManager;
let socket: MockSocket;
let playerStates: PlayerStateRepository;
let delegator: PlayerStateDelegator;

beforeEach(() => {
  socket = new MockSocket();
  playerStates = new InMemoryPlayerStateRepository();
  roomManager = new SocketRoomManager(playerStates);
  delegator = new PlayerStateDelegator(roomManager, playerStates, socket);
});
