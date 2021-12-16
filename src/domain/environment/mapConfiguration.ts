export interface MapConfiguration {
    singleMapSize: { x: number, y: number },
    patronSizeInPixels: number,
    mapLayers: MapLayer[],
}

export interface MapLayer {
    id: number,
    mapsInOrder: (number[])[]
}

/*
Example: 

mapsInOrder:[ [0,1,2] , [3,4,5], [6,7,8] ]  

== >    | 0  1  2 |    map 4 have map 3 on left, map 1 on top and that with all maps...
        | 3  4  5 |
        | 6  7  8 |
              */ 