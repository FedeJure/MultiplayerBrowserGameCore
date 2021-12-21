import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { createMapOnScene } from "../actions/createMapOnScene";
import { loadMapAssets } from "../actions/loadMapAssets";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

export class CurrentMapDelegator implements Delegator {
  public constructor(
    private scene: ClientGameScene,
    private localPlayerId: string,
    private connection: ServerConnection,
    private statesRepository: PlayerStateRepository,
    private originUrl: string
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap]);
      this.createMap([ev.newMap]);
      await this.loadAssets(ev.neighborMaps);
      this.createMap(ev.neighborMaps);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  private async loadAssets(maps: ProcessedMap[]) {
    return Promise.all(
      maps.map((m) => loadMapAssets(this.originUrl, m, this.scene))
    );
  }

  private createMap(maps: ProcessedMap[]) {
    try {
      maps.forEach((m) => {
        createMapOnScene(m, this.scene);
      });
    } catch (error) {}
  }
}
