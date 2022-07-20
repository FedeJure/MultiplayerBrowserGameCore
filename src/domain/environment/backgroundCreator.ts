import { GameObjects, Scene } from "phaser";
import { ExistentDepths } from "../../view/existentDepths";
import { loadBackgroundAssets } from "../actions/loadBackgroundAssets";
import { PlayerInfo } from "../player/playerInfo";
import { Player } from "../player/players/player";
import { SimpleRepository } from "../repository";
import { ProcessedMap } from "./processedMap";

export class BackgroundCreator {
  private createdBackgrounds: GameObjects.Image[] = [];
  private createdBackgroundsMap: { [key: string]: GameObjects.Image } = {};

  constructor(
    private scene: Scene,
    private localPlayerId: PlayerInfo["id"],
    private inGamePlayersRepository: SimpleRepository<Player>
  ) {}
  private async loadAssets(maps: ProcessedMap[]) {
    return Promise.all(maps.map((m) => loadBackgroundAssets(m, this.scene)));
  }

  private createBackground(
    currentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ) {
    try {
      const localPlayer = this.inGamePlayersRepository.get(this.localPlayerId);
      if (localPlayer) {
        currentMap.config.backgroundFile.forEach((bg, i) => {
          const isOnlyOne = currentMap.config.backgroundFile.length === 1;
          const factor = isOnlyOne
            ? 0
            : (i / currentMap.config.backgroundFile.length) * 0.5;

          neighborMaps.forEach((nm) => {
            const nb = nm.config.backgroundFile[i];
            if (this.createdBackgroundsMap[nb.key]) {
              this.createdBackgroundsMap[nb.key]
                .setActive(true)
                .setVisible(true);
              return;
            }
            const createdNeighbor = this.scene.add
              .image(nm.originX, nm.originY, nb.key)
              .setScrollFactor(factor, undefined)
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
            .image(currentMap.originX, currentMap.originY, bg.key)
            .setScrollFactor(factor, undefined)
            .setOrigin(0.5, 0)
            .setDepth(ExistentDepths.BACKGROUND);

          this.createdBackgroundsMap[bg.key] = currentBg;
          this.createdBackgrounds.push(currentBg);
        });
      }
    } catch (error) {}
  }

  public async process(currentMap:ProcessedMap, maps: ProcessedMap[]) {
    await this.loadAssets([currentMap, ...maps]);
    await this.createBackground(currentMap, maps);
  }
}
