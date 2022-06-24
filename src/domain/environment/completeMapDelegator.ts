import { Scene } from "phaser";
import difference from "lodash.difference";
import { createMapOnScene } from "../actions/createMapOnScene";
import { loadMapAssets } from "../actions/loadMapAssets";
import { Delegator } from "../delegator";
import { RoomManager } from "../roomManager";
import { Socket } from "socket.io";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { EnvironmentObjectRepository } from "../environmentObjects/environmentObjectRepository";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { ServerEnvironmentObjectFactory } from "../../view/environmentObjects/serverEnvironmentObjectFactory";
import { ServerPlayer } from "../player/players/serverPlayer";
import { SimpleRepository } from "../repository";
import { filter } from "rxjs";
import { MapManager } from "./mapManager";
import { PlayerState } from "../player/playerState";
import { CollisionManager } from "../collisions/collisionManager";
import { Loot } from "../loot/loot";

export class CompleteMapDelegator implements Delegator {
  public constructor(
    private mapManager: MapManager,
    private scene: Scene,
    private roomManager: RoomManager,
    private socket: Socket,
    private envObjectsRepository: EnvironmentObjectRepository,
    private presenterProvider: ServerPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private collisionManager: CollisionManager,
    private lootsRepository: SimpleRepository<Loot>
  ) {
    this.inGamePlayersRepository.onSave.subscribe((serverPlayer) => {
      serverPlayer.onStateChange
        .pipe(filter(({ change }) => change.position !== undefined))
        .subscribe(({ state }) => {
          this.updateMapAndSendEvents(serverPlayer, state);
        });
    });
  }

  private async updateMapAndSendEvents(
    player: ServerPlayer,
    newState: PlayerState
  ) {
    this.updateMapForPlayer(player).then(async (joinedRooms) => {
      player.updateState({ currentRooms: joinedRooms });
      const newRooms: string[] = difference(joinedRooms, newState.currentRooms);
      if (newRooms.length === 0) return;

      this.socket.in(newRooms).emit(
        GameEvents.NEW_PLAYER_CONNECTED.name,
        GameEvents.NEW_PLAYER_CONNECTED.getEvent({
          id: player.info.id,
          info: player.info,
          state: newState,
        })
      );

      this.sendAlreadyConnectedPlayers(player, newRooms);

      const leavingRooms: string[] = difference(
        newState.currentRooms,
        joinedRooms
      );
      if (leavingRooms.length === 0) return;
      this.sendExistentLoots(player, newRooms, leavingRooms);

      this.socket
        .in(leavingRooms)
        .emit(
          GameEvents.PLAYER_DISCONNECTED.name,
          GameEvents.PLAYER_DISCONNECTED.getEvent(player.info.id)
        );
    });
  }

  private async sendExistentLoots(
    player: ServerPlayer,
    newRooms: string[],
    leavingRooms: string[]
  ) {
    const connection = player.connection;
    const newLoots = this.lootsRepository
      .getAll()
      .filter((l) => newRooms.includes(l.mapId.toString()));
    const oldLoots = this.lootsRepository
      .getAll()
      .filter((l) => leavingRooms.includes(l.mapId.toString()));
    if (newLoots.length > 0) {
      connection.sendLootAppear(newLoots);
    }
    if (oldLoots.length > 0) {
      connection.sendLootDisappear(oldLoots);
    }
  }

  private async sendAlreadyConnectedPlayers(
    player: ServerPlayer,
    newRooms: string[]
  ) {
    const connection = player.connection;
    newRooms.forEach((r) => {
      const playerIds = this.roomManager.getPlayersByRoom()[r] ?? [];
      playerIds.forEach(async (p) => {
        try {
          connection?.sendConnectedPlayer({
            id: player.info.id,
            state: player.state,
            info: player.info,
          });
        } catch (error) {}
      });
    });
  }

  private updateMapForPlayer(player: ServerPlayer) {
    const { foundedMap, neighborMaps } =
      this.mapManager.getMapForPlayer(player);
    if (foundedMap && neighborMaps && foundedMap.id !== player.state.mapId) {
      player.updateState({
        mapId: foundedMap.id,
      });
      const connection = player.connection;
      if (connection) {
        connection.sendMapUpdateEvent(foundedMap, neighborMaps);
        return this.roomManager.joinToRoom(player.info.id, connection, [
          foundedMap,
          ...neighborMaps,
        ]);
      }
    }
    return Promise.resolve(player.state.currentRooms);
  }

  init(): void {
    Promise.all(
      this.mapManager.maps.map((m) => loadMapAssets(m, this.scene))
    ).then((_) =>
      this.mapManager.maps.forEach((m) =>
        createMapOnScene(
          m,
          this.scene,
          this.envObjectsRepository,
          new ServerEnvironmentObjectFactory(
            this.scene,
            this.presenterProvider
          ),
          this.collisionManager
        ).then(({ spawnPositions }) => {
          this.mapManager.setSpawnPositions(m.id, spawnPositions);
        })
      )
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
