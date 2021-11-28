import { CollisionCategory } from "./collisionTypes";
export interface CollisionData {
    tangent: {
        x: number;
        y: number;
    };
    normal: {
        x: number;
        y: number;
    };
    collidedCategory: CollisionCategory;
}
