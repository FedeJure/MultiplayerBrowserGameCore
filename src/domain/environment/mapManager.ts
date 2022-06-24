import { ControllablePlayer } from "../player/players/controllablePlayer";
import { Vector } from "../vector";
import { Map } from "./mapConfiguration";
import { ProcessedMap } from "./processedMap";

export class MapManager {
  protected processedMaps: { [key: Map["id"]]: ProcessedMap } = {};
  protected processedMapsAsList: ProcessedMap[] = [];

  setMaps(maps: ProcessedMap[]) {
    this.processedMapsAsList = maps;
    this.processedMaps = {};
    maps.forEach((m) => {
      this.processedMaps[m.id] = m;
    });
  }

  protected isInside(x: number, y: number, map: ProcessedMap) {
    return (
      x > map.originX &&
      y > map.originY &&
      x < map.originX + map.width &&
      y < map.originY + map.height
    );
  }

  public get maps() {
    return this.processedMapsAsList;
  }

  public getMap(id: Map["id"]) {
    return this.processedMaps[id];
  }

  public setSpawnPositions(id: Map["id"], positions: Vector[]) {
    this.processedMaps[id].spawnPositions = positions;
  }

  getMapForPlayer(player: ControllablePlayer) {
    const { state } = player;
    const currentMap = this.processedMaps[state.mapId];
    if (!this.isInside(state.position.x, state.position.y, currentMap)) {
      const foundedMap = this.processedMapsAsList.find((map) =>
        this.isInside(state.position.x, state.position.y, map)
      );
      return {
        foundedMap,
        neighborMaps: [
          foundedMap?.bottomMapId,
          foundedMap?.topMapId,
          foundedMap?.leftBottomMapId,
          foundedMap?.leftMapId,
          foundedMap?.leftTopMapId,
          foundedMap?.rightBottomMapId,
          foundedMap?.rightMapId,
          foundedMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
    } else
      return {
        foundedMap: currentMap,
        neighborMaps: [
          currentMap?.bottomMapId,
          currentMap?.topMapId,
          currentMap?.leftBottomMapId,
          currentMap?.leftMapId,
          currentMap?.leftTopMapId,
          currentMap?.rightBottomMapId,
          currentMap?.rightMapId,
          currentMap?.rightTopMapId,
        ]
          .filter((id) => id !== undefined)
          .map((id) => this.processedMaps[id as number]),
      };
  }
}
