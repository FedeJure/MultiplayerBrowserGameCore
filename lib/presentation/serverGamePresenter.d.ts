import { GameScene } from "../view/scenes/GameScene";
import { RoomConnection } from "../domain/roomConnection";
import { CreatePlayerFromId } from "../domain/actions/providePlayerFromId";
import { ConnectionsRepository } from "../infrastructure/repositories/connectionsRepository";
import { ConnectedPlayersRepository } from "../infrastructure/repositories/connectedPlayersRepository";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";
export declare class ServerGamePresenter {
    readonly gameScene: GameScene;
    readonly room: RoomConnection;
    readonly createPlayer: CreatePlayerFromId;
    readonly connectionsRepository: ConnectionsRepository;
    readonly connectedPlayers: ConnectedPlayersRepository;
    readonly playerStates: PlayerStateRepository;
    private playerConnections;
    constructor(gameScene: GameScene, room: RoomConnection, createPlayerFromId: CreatePlayerFromId, connectionsRepository: ConnectionsRepository, connectedPlayers: ConnectedPlayersRepository, playerStates: PlayerStateRepository);
    listenEvents(): void;
}
