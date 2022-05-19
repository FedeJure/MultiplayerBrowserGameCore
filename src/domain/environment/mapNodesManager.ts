import { Map as DomainMap } from "./mapConfiguration";
import { MapNode } from "./mapNode";

export class MapNodesManager {
    private nodes: Map<DomainMap['id'], MapNode[]> = new Map()
    addNode(mapId: DomainMap['id'], node: MapNode) {
        if (!this.nodes.get(mapId)) this.nodes.set(mapId, [])
        this.nodes.get(mapId)?.push(node)
    }
    getNodes(mapId: DomainMap['id']) {
        return this.nodes.get(mapId) ?? []
    }
}