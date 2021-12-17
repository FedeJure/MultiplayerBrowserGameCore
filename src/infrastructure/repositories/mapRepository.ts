import { ProcessedMap } from "../../domain/environment/processedMap";

type MapId = number

export class MapRepository {

    private processedMaps: { [key: MapId]: ProcessedMap } = {};
    constructor() {}

    getMaps() {
        return this.processedMaps
    }

    setMaps(maps: { [key: MapId]: ProcessedMap }) {
        this.processedMaps = {...maps}
    }
}