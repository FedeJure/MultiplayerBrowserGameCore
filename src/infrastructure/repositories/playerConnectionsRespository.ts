import { Subject } from "rxjs";

type PlayerId = string;
type ConnectionId = string;
export class PlayerConnectionsRepository {
  private _onNewPlayerConnected = new Subject<{
    playerId: PlayerId;
    connectionId: ConnectionId;
  }>();
  private mapConnections: { [key: PlayerId]: ConnectionId } = {};
  private mapPlayers: { [key: ConnectionId]: PlayerId } = {};

  constructor() {}

  addConnection(playerId: PlayerId, connectionId: ConnectionId) {
    this.mapConnections[playerId] = connectionId;
    this.mapPlayers[connectionId] = playerId;
    this._onNewPlayerConnected.next({ playerId, connectionId });
  }

  getConnection(playerId: PlayerId): ConnectionId | undefined {
    return this.mapConnections[playerId];
  }

  getPlayer(connectionId: ConnectionId): PlayerId | undefined {
    return this.mapPlayers[connectionId];
  }

  removeConnection(playerId: PlayerId, connectionId: ConnectionId) {
    delete this.mapConnections[playerId];
    delete this.mapPlayers[connectionId];
  }

  public get onNewPlayerConnected() {
    return this._onNewPlayerConnected;
  }
}
