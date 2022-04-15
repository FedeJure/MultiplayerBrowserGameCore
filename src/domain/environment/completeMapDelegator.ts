import { Scene } from "phaser";
import difference from "lodash.difference";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { createMapOnScene } from "../actions/createMapOnScene";
import { loadMapAssets } from "../actions/loadMapAssets";
import { Delegator } from "../delegator";
import { PlayerState } from "../player/playerState";
import { RoomManager } from "../roomManager";
import { MapConfiguration, MapLayer } from "./mapConfiguration";
import { ProcessedMap } from "./processedMap";
import { Socket } from "socket.io";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";

export class CompleteMapDelegator implements Delegator {
  private readonly maxWorldWidht = 10000;
  private readonly maxWorldHeight = Infinity;

  private static processedMaps: { [key: number]: ProcessedMap } = {};
  private static processedMapsAsList: ProcessedMap[] = [];
  private currentX = 0;
  private currentY = 0;
  public constructor(
    private mapConfig: MapConfiguration,
    private playerStateRepository: PlayerStateRepository,
    private connections: ConnectionsRepository,
    private playerConnections: PlayerConnectionsRepository,
    private scene: Scene,
    private roomManager: RoomManager,
    private socket: Socket,
    private playersRepository: PlayerInfoRepository,
    private envObjectsRepository: EnvironmentObjectRepository
  ) {
    mapConfig.mapLayers.forEach((layer) => {
      this.processLayer(layer);
    });

    playerConnections.onNewPlayerConnected.subscribe(({ playerId }) => {
      const state = playerStateRepository.getPlayerState(playerId);
      if (!state) return;
      this.updateMapForPlayer(state, playerId);
    });
    playerStateRepository.onPlayerStateChange.subscribe(
      ({ playerId, state }) => {
        this.updateMapForPlayer(state, playerId).then((joinedRooms) => {
          const newRooms: string[] = difference(
            joinedRooms,
            state.currentRooms
          );
          if (newRooms.length === 0) return;
          const playerInfo = this.playersRepository.getPlayer(playerId);
          if (!playerInfo) return;

          socket.in(newRooms).emit(
            GameEvents.NEW_PLAYER_CONNECTED.name,
            GameEvents.NEW_PLAYER_CONNECTED.getEvent({
              id: playerId,
              info: playerInfo,
              state: state,
            })
          );

          this.sendAlreadyConnectedPlayers(playerId, newRooms);

          const leavingRooms: string[] = difference(
            state.currentRooms,
            joinedRooms
          );
          if (leavingRooms.length === 0) return;
          this.socket
            .in(leavingRooms)
            .emit(
              GameEvents.PLAYER_DISCONNECTED.name,
              GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
            );
        });
      }
    );
  }

  private sendAlreadyConnectedPlayers(playerId: string, newRooms: string[]) {
    const connId = this.playerConnections.getConnection(playerId);
    if (!connId) return;
    const connection = this.connections.getConnection(connId);
    newRooms.forEach((r) => {
      const playerIds = this.roomManager.getPlayersByRoom()[r] ?? [];
      playerIds.forEach((p) => {
        try {
          const state = this.playerStateRepository.getPlayerState(p)!;
          const info = this.playersRepository.getPlayer(p)!;
          connection?.sendConnectedPlayer({
            id: info.id,
            state,
            info,
          });
        } catch (error) {}
      });
    });
  }

  private updateMapForPlayer(state: PlayerState, playerId: string) {
    const { foundedMap, neighborMaps } =
      CompleteMapDelegator.getMapForPlayer(state);
    if (foundedMap && neighborMaps && foundedMap.id !== state.map.mapId) {
      this.playerStateRepository.updateStateOf(playerId, {
        map: { mapId: foundedMap.id },
      });
      const connectionId = this.playerConnections.getConnection(playerId);
      if (connectionId) {
        const connection = this.connections.getConnection(connectionId);
        if (connection) {
          connection.sendMapUpdateEvent(foundedMap, neighborMaps);
          return this.roomManager.joinToRoom(playerId, connection, [
            foundedMap,
            ...neighborMaps,
          ]);
        }
      }
    }
    return Promise.resolve(state.currentRooms);
  }

  private static isInside(x: number, y: number, map: ProcessedMap) {
    return (
      x > map.originX &&
      y > map.originY &&
      x < map.originX + map.width &&
      y < map.originY + map.height
    );
  }

  processLayer(layer: MapLayer) {
    layer.mapsInOrder.forEach((horizontalMaps, i) => {
      horizontalMaps.forEach((map, j) => {
        CompleteMapDelegator.processedMaps[map.id] = {
          config: map,
          layerId: layer.id,
          id: map.id,
          originX: this.currentX,
          originY: this.currentY,
          height:
            this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels,
          width:
            this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels,
          leftMapId: (layer.mapsInOrder[i] ?? {})[j - 1]?.id,
          rightMapId: (layer.mapsInOrder[i] ?? {})[j + 1]?.id,
          topMapId: (layer.mapsInOrder[i - 1] ?? {})[j]?.id,
          bottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j]?.id,
          leftTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j - 1]?.id,
          rightTopMapId: (layer.mapsInOrder[i - 1] ?? {})[j + 1]?.id,
          leftBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j - 1]?.id,
          rightBottomMapId: (layer.mapsInOrder[i + 1] ?? {})[j + 1]?.id,
        };

        const nextX =
          this.currentX +
          this.mapConfig.singleMapSize.x * this.mapConfig.patronSizeInPixels;
        this.currentX = nextX > this.maxWorldWidht ? 0 : nextX;
        if (nextX > this.maxWorldWidht) {
          const nextY =
            this.currentY +
            this.mapConfig.singleMapSize.y * this.mapConfig.patronSizeInPixels;
          this.currentY = nextY > this.maxWorldHeight ? 0 : nextY;
        }
      });
    });
    CompleteMapDelegator.processedMapsAsList = Object.values(
      CompleteMapDelegator.processedMaps
    );
  }

  init(): void {
    Promise.all(
      CompleteMapDelegator.processedMapsAsList.map((m) =>
        loadMapAssets(m, this.scene)
      )
    ).then((_) =>
      CompleteMapDelegator.processedMapsAsList.forEach((m) =>
        createMapOnScene(m, this.scene, this.envObjectsRepository)
      )
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  public static getMapForPlayer(state: PlayerState): {
    foundedMap?: ProcessedMap;
    neighborMaps?: ProcessedMap[];
  } {
    const currentMap = this.processedMaps[state.map.mapId];
    if (!this.isInside(state.position.x, state.position.y, currentMap)) {
      const foundedMap = this.processedMapsAsList.find((map) =>
        this.isInside(state.position.x, state.position.y, map)
      );
      return {
        foundedMap,
        neighborMaps: [
          foundedMap?.bottomMapId,
          foundedMap?.topMapId,
          foundedMap?.leftBottomMapId,
          foundedMap?.leftMapId,
          foundedMap?.leftTopMapId,
          foundedMap?.rightBottomMapId,
          foundedMap?.rightMapId,
          foundedMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
    } else
      return {
        foundedMap: currentMap,
        neighborMaps: [
          currentMap?.bottomMapId,
          currentMap?.topMapId,
          currentMap?.leftBottomMapId,
          currentMap?.leftMapId,
          currentMap?.leftTopMapId,
          currentMap?.rightBottomMapId,
          currentMap?.rightMapId,
          currentMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
  }
}
