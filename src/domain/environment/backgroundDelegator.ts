import { GameObjects } from "phaser";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { LocalPlayerRepository } from "../../infrastructure/repositories/localPlayerRepository";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { loadBackgroundAssets } from "../actions/loadBackgroundAssets";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

export class BackgroundDelegator implements Delegator {
  private localPlayer?: Player;
  private currentBackgrounds: GameObjects.Image[] = [];
  private mapWidth = 0;
  private mapCenterX = 0;
  private mapCenterY = 0;

  public constructor(
    private scene: ClientGameScene,
    private connection: ServerConnection,
    private originUrl: string,
    private localplayerRepository: LocalPlayerRepository,
    private playersRepository: ConnectedPlayersRepository
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      this.mapWidth = ev.newMap.width;
      console.log(ev.newMap)
      this.mapCenterX = ev.newMap.originX + this.mapWidth / 2;
      this.mapCenterY = ev.newMap.originY + ev.newMap.height / 2;
      console.log(this.mapCenterX)
      await this.loadAssets([ev.newMap]);
      await this.createBackground([ev.newMap]);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {
    const localPlayer = this.localPlayer;
    if (localPlayer) {
      this.currentBackgrounds.forEach((bg, i) => {
        const isOnlyOne = this.currentBackgrounds.length === 1
        const factor =  isOnlyOne ? 0 : (i / this.currentBackgrounds.length);
        const newX = localPlayer.view.position.x - (localPlayer.view.position.x -this.mapCenterX) * factor
        const newy = localPlayer.view.position.y + (localPlayer.view.position.y -this.mapCenterY) * factor / 1000
        bg.setPosition(
          newX,
          newy
        );
      });
    }
  }

  private async loadAssets(maps: ProcessedMap[]) {
    return Promise.all(
      maps.map((m) => loadBackgroundAssets(this.originUrl, m, this.scene))
    );
  }

  private createBackground(maps: ProcessedMap[]) {
    try {
      if (this.currentBackgrounds.length > 0) {
        this.currentBackgrounds.forEach((bg) => {
          bg.destroy();
        });
        this.currentBackgrounds = [];
      }
      return Promise.all(
        maps.map((m) => {
          const localPlayer = this.playersRepository.getPlayer(
            this.localplayerRepository.playerId
          );
          this.localPlayer = localPlayer;
          if (localPlayer) {
            m.config.backgroundFile.forEach((bg) => {
              const image = this.scene.add.image(
                localPlayer.view.position.x,
                localPlayer.view.position.y,
                bg.key
              );
              image.setDepth(-1);
              image.setOrigin(0.5, 0.75);

              this.currentBackgrounds.push(image);
            });
          }
        })
      );
    } catch (error) {}
  }
}
