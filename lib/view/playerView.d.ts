/// <reference types="./matter" />
import { BodyType } from "matter";
import { Physics } from "phaser";
import { Observable } from "rxjs";
import { PlayerView } from "../presentation/playerView";
import { GameScene } from "./scenes/GameScene";
export declare class PhaserPlayerView extends Physics.Matter.Sprite implements PlayerView {
    private readonly _onUpdate;
    private readonly _onPreUpdate;
    constructor(scene: GameScene, x: number, y: number, height: number, width: number);
    private initCollisions;
    destroy(): void;
    preUpdate(time: number, delta: number): void;
    update(time: number, delta: number): void;
    get onUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
    get onPreUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
    get matterBody(): BodyType;
}
