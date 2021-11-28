import { Subject } from "rxjs";
import { Socket } from "socket.io-client";
import { ServerConnection } from "../domain/serverConnection";
import { PlayerInputDto } from "./dtos/playerInputDto";
import { InitialGameStateEvent, NewPlayerConnectedEvent, PlayerDisconnectedEvent, PlayerStatesEvent } from "./events/gameEvents";
export declare class SocketServerConnection implements ServerConnection {
    readonly socket: Socket;
    private readonly _onInitialGameState;
    private readonly _onNewPlayerConnected;
    private readonly _onPlayersStates;
    private readonly _onPlayerDisconnected;
    private readonly _onPing;
    constructor(socket: Socket);
    get onInitialGameState(): Subject<InitialGameStateEvent>;
    get onNewPlayerConnected(): Subject<NewPlayerConnectedEvent>;
    get onPlayersStates(): Subject<PlayerStatesEvent>;
    get onPlayerDisconnected(): Subject<PlayerDisconnectedEvent>;
    get onPing(): Subject<number>;
    emitStartNewConnection(playerId: string): void;
    emitInput(playerId: string, input: PlayerInputDto, inputRequest: number): void;
}
