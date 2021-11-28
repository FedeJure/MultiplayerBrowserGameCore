import { Observable } from "rxjs";
import { Scene } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
export declare class GameScene extends Scene {
    private _onUpdate;
    private _onCreate;
    private _lifeCycleObjects;
    private _collisionDispatcher;
    constructor(collisionDispatcher: CollisionsDispatcher);
    create(): void;
    initCollisions(): void;
    update(time: number, delta: number): void;
    addToLifecycle(object: Phaser.GameObjects.GameObject): void;
    removeFromLifecycle(object: Phaser.GameObjects.GameObject): void;
    get onUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
    get onCreate(): Observable<void>;
    private initPlatforms;
}
