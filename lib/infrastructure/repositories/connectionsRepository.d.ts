import { Subject } from "rxjs";
import { ClientConnection } from "../../domain/clientConnection";
export declare class ConnectionsRepository {
    private connections;
    private onNewConnectionSubject;
    private onDisconnectionSubject;
    addConnection(connection: ClientConnection): void;
    removeConnection(id: string): void;
    getAllConnections(): Array<ClientConnection>;
    onNewConnection: () => Subject<ClientConnection>;
    onDisconnection: () => Subject<ClientConnection>;
}
