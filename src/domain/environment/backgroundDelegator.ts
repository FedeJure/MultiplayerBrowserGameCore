import { GameObjects, Scene } from "phaser";
import { LocalPlayerRepository } from "../../infrastructure/repositories/localPlayerRepository";
import { ExistentDepths } from "../../view/existentDepths";
import { loadBackgroundAssets } from "../actions/loadBackgroundAssets";
import { Delegator } from "../delegator";
import { ControllablePlayer } from "../player/players/controllablePlayer";
import { SimpleRepository } from "../repository";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

export class BackgroundDelegator implements Delegator {
  private createdBackgrounds: GameObjects.Image[] = [];

  private createdBackgroundsMap: { [key: string]: GameObjects.Image } = {};

  public constructor(
    private scene: Scene,
    private connection: ServerConnection,
    private localplayerRepository: LocalPlayerRepository,
    private inGamePlayersRepository: SimpleRepository<ControllablePlayer>
  ) {}
init(): void {

    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap, ...ev.neighborMaps]);
      await this.createBackground(ev.newMap, ev.neighborMaps);
    });
    // this.scene.input.on(
    //   "wheel",
    //   (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    //     const scale = this.scene.cameras.main.zoom * this.initialScale / this.initialZoom;
    //     console.log(scale)

    //     this.createdBackgrounds.forEach(bg => {
    //       bg.setScale(scale, scale)
    //     })
    //   }
    // );
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  private async loadAssets(maps: ProcessedMap[]) {
    return Promise.all(maps.map((m) => loadBackgroundAssets(m, this.scene)));
  }

  private createBackground(
    currentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ) {
    try {
      const localPlayer = this.inGamePlayersRepository.get(
        this.localplayerRepository.playerId
      );

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
}
