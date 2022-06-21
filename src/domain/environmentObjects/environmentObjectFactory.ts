import { MapEnvironmentObject } from "../environment/mapEnvironmentObject";

export interface EnvironmentObjectFactory {
    createObjects(objs: MapEnvironmentObject[])
}