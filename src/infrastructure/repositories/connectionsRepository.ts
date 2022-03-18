import { Subject } from "rxjs";
import { ClientConnection } from "../../domain/clientConnection";

type ConnectionId = ClientConnection['connectionId'];
export class ConnectionsRepository {
  private connections = new Array<ClientConnection>();
  private mapConnections: { [key: ConnectionId]: ClientConnection } = {};
  private onNewConnectionSubject = new Subject<ClientConnection>();
  private onDisconnectionSubject = new Subject<ClientConnection>();

  addConnection(connection: ClientConnection) {
    this.mapConnections[connection.connectionId] = connection
    this.connections.push(connection);
    this.onNewConnectionSubject.next(connection);
  }

  getConnection(id: ConnectionId): ClientConnection | undefined {
    return this.mapConnections[id]
  }

  removeConnection(id: ConnectionId) {
    delete this.mapConnections[id]
    const connection = this.connections.find((c) => c.connectionId == id);
    if (!connection) {
      console.log(
        `[Connections Repository] Warning :: You are trying to remove a connection that not exists with id: ${id}`
      );
    }
    this.connections = this.connections.filter((c) => c.connectionId != id);
    this.onDisconnectionSubject.next(connection as ClientConnection);
  }

  getAllConnections(): Array<ClientConnection> {
    return this.connections;
  }

  onNewConnection = () => this.onNewConnectionSubject;
  onDisconnection = () => this.onDisconnectionSubject;
}
