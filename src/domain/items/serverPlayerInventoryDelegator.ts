import { Log } from "../../infrastructure/Logger";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { Delegator } from "../delegator";
import { InventoryRepository } from "./inventoryRepository";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private playerConnectionRepository: PlayerConnectionsRepository,
    private connectionsRepository: ConnectionsRepository,
    private inventoryRepository: InventoryRepository
  ) {}
  init(): void {
    this.playerConnectionRepository.onNewPlayerConnected.subscribe(
      ({ playerId, connectionId }) => {
          try {
            const connection = this.connectionsRepository.getConnection(connectionId)
            if (!connection) return
            const inventory = this.inventoryRepository.get(playerId)
  
            connection.sendInventoryEvent(inventory) 
          } catch (error: any) {
            Log('ServerPlayerInventoryDelegator [Error]:  ', error)
          }
          
      }
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
