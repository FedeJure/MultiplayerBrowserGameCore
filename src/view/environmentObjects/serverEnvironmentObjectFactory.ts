import { Scene } from "phaser";
import { MapEnvironmentObject } from "../../domain/environment/mapEnvironmentObject";
import { EnvironmentObjectFactory } from "../../domain/environmentObjects/environmentObjectFactory";

export class ServerEnvironmentObjectFactory implements EnvironmentObjectFactory {
    constructor(private scene: Scene) {

    }
    
    createObjects(objs: MapEnvironmentObject[]) {
        console.log("Creating objects on server", objs)
    }


}