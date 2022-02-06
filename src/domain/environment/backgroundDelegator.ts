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
  public constructor(
    private scene: ClientGameScene,
    private connection: ServerConnection,
    private originUrl: string,
    private localplayerRepository: LocalPlayerRepository,
    private playersRepository: ConnectedPlayersRepository
  ) {}
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap]);
      await this.createBackground([ev.newMap]);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {
    const localPlayer = this.localPlayer;
    if (localPlayer) {
      this.currentBackgrounds.forEach((bg) => {
        bg.setPosition(
          localPlayer.view.position.x,
          localPlayer.view.position.y
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
        this.currentBackgrounds.forEach(bg => {
          bg.destroy()
        })
        this.currentBackgrounds = []
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
