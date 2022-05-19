import { ControllablePlayer } from "../player/players/controllablePlayer";
import { Map } from "./mapConfiguration";
import { MapNodesManager } from "./mapNodesManager";
import { ProcessedMap } from "./processedMap";

export class MapManager {
  protected processedMaps: { [key: Map["id"]]: ProcessedMap } = {};
  protected processedMapsAsList: ProcessedMap[] = [];
  public readonly mapNodesManager: MapNodesManager = new MapNodesManager()

  setMaps(maps: ProcessedMap[]) {
    this.processedMapsAsList = [...maps]
    this.processedMaps = {}
    maps.forEach(m => {
      this.processedMaps[m.id] = m
    })
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
