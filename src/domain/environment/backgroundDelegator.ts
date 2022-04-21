import { GameObjects } from "phaser";
import { LocalPlayerRepository } from "../../infrastructure/repositories/localPlayerRepository";
import { ExistentDepths } from "../../view/existentDepths";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { loadBackgroundAssets } from "../actions/loadBackgroundAssets";
import { Delegator } from "../delegator";
import { InGamePlayersRepository } from "../player/inGamePlayersRepository";
import { ClientPlayer } from "../player/player";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

export class BackgroundDelegator implements Delegator {
  private createdBackgrounds: GameObjects.Image[] = [];
  private createdBackgroundsMap: { [key: string]: GameObjects.Image } = {};

  public constructor(
    private scene: ClientGameScene,
    private connection: ServerConnection,
    private localplayerRepository: LocalPlayerRepository,
    private inGamePlayersRepository: InGamePlayersRepository<ClientPlayer>
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap, ...ev.neighborMaps]);
      await this.createBackground(ev.newMap, ev.neighborMaps);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  private async loadAssets(maps: ProcessedMap[]) {
    return Promise.all(
      maps.map((m) => loadBackgroundAssets(m, this.scene))
    );
  }

  private createBackground(
    currentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ) {
    try {
      const localPlayer = this.inGamePlayersRepository.get(this.localplayerRepository.playerId)

      if (localPlayer) {
        currentMap.config.backgroundFile.forEach((bg, i) => {
          const isOnlyOne = currentMap.config.backgroundFile.length === 1;
          const factor = isOnlyOne
            ? 0
            : (i / currentMap.config.backgroundFile.length) *0.9;
  
          neighborMaps.forEach((nm) => {
            const nb = nm.config.backgroundFile[i];
            if (this.createdBackgroundsMap[nb.key]) {
              this.createdBackgroundsMap[nb.key].setActive(true).setVisible(true);
              return;
            }
            const createdNeighbor = this.scene.add
              .image(nm.originX, nm.originY - nm.height * 0.2, nb.key)
              .setScrollFactor(factor, factor / 10)
              .setOrigin(0.5, 0)
              .setDepth(ExistentDepths.BACKGROUND);
            this.createdBackgroundsMap[nb.key] = createdNeighbor;
            this.createdBackgrounds.push(createdNeighbor);
          });
  
          if (this.createdBackgroundsMap[bg.key]) {
            this.createdBackgroundsMap[bg.key].setActive(true).setVisible(true);
            return;
          }
  
          const currentBg = this.scene.add
            .image(
              currentMap.originX,
              currentMap.originY - currentMap.height * 0.2,
              bg.key
            )
            .setScrollFactor(factor, factor / 10)
            .setOrigin(0.5, 0)
            .setDepth(ExistentDepths.BACKGROUND);
  
          this.createdBackgroundsMap[bg.key] = currentBg;
          this.createdBackgrounds.push(currentBg);
        });
      }

      
    } catch (error) {}
  }
}
