import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { MapManager } from "../environment/mapManager";
import { ServerPlayer } from "./players/serverPlayer";

export class PlayerTransportation {
  private player: ServerPlayer;
  private lastTimeTransport: number;

  constructor(private mapManager: MapManager) {}
  init(player: ServerPlayer) {
    this.player = player;
  }

  update(time: number, delta: number) {
    const exit = this.player.view.currentExit;
    if (
      !this.player.state.transporting &&
      exit &&
      this.lastTimeTransport +
        DefaultGameConfiguration.timeBetweenTransportations >
        Date.now()
    ) {
      const destinationMap = this.mapManager.getMap(exit.destinationMapId);
      const destinationEntrance = destinationMap.entrances.find(
        (e) => e.id == exit.destinationEntranceId
      );

      if (!destinationEntrance) return;
      this.player.view.setVelocity(0, 0);
      this.player.updateState({
        transporting: true,
      });

      setTimeout(() => {
        this.player.view.setPosition(
          destinationEntrance.position.x,
          destinationEntrance.position.y
        );
        this.player.updateState({
          transporting: false,
        });
      }, 2000);
    }
  }
}
