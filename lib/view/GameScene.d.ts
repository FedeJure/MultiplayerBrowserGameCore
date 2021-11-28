import { Observable } from 'rxjs';
import { Scene } from "phaser";
export declare class GameScene extends Scene {
    private _onUpdate;
    private _onCreate;
    constructor();
    create(): void;
    update(time: number, delta: number): void;
    get onUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
    get onCreate(): Observable<void>;
    initPlatforms: () => void;
}
