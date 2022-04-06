import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { Delegator } from "../delegator";
import { InventoryRepository } from "./inventoryRepository";
import { DefaultItem, TestItem } from "./item";
import { ItemsRepository } from "./itemsRepository";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private playerConnectionRepository: PlayerConnectionsRepository,
    private connectionsRepository: ConnectionsRepository,
    private inventoryRepository: InventoryRepository,
    private itemsRepository: ItemsRepository
  ) {}
  init(): void {
    this.itemsRepository.save(TestItem);

    this.playerConnectionRepository.onNewPlayerConnected.subscribe(
      ({ playerId, connectionId }) => {
        try {
          const connection =
            this.connectionsRepository.getConnection(connectionId);
          if (!connection) return;
          connection.onItemDetailRequest().subscribe((ev) => {
            const items = ev.ev.itemIds.map(
              (id) => this.itemsRepository.get(id) ?? DefaultItem
            );
            ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
          });
          const inventory = this.inventoryRepository.get(playerId);

          connection.sendInventoryEvent(inventory);
        } catch (error: any) {
          Log("ServerPlayerInventoryDelegator [Error]:  ", error);
        }
      }
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
