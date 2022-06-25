import { MapManager } from "../environment/mapManager";
import { ServerPlayer } from "./players/serverPlayer";

export class PlayerTransportation {
  private player: ServerPlayer;
  constructor(private mapManager: MapManager) {}
  init(player: ServerPlayer) {
    this.player = player;
  }

  update(time: number, delta) {
    const exit = this.player.view.currentExit;
    if (!this.player.state.transporting && exit) {

      const destinationMap = this.mapManager.getMap(exit.destinationMapId);
      const destinationEntrance = destinationMap.entrances.find(
        (e) => e.id == exit.destinationEntranceId
      );

      if (!destinationEntrance) return;
      this.player.view.setPosition(destinationEntrance.position.x, destinationEntrance.position.y)
      this.player.view.setVelocity(0,0)
      this.player.updateState({
        position: destinationEntrance.position,
        velocity: { x: 0, y: 0 },
        transporting: true,
      });
    }
  }
}
