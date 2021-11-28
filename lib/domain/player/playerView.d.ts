import { Observable } from "rxjs";
export interface PlayerView {
    body: {
        position: {
            x: number;
            y: number;
        };
        velocity: {
            x: number;
            y: number;
        };
    };
    setVelocity(x: number, y: number): void;
    setPosition(x: number, y: number): void;
    destroy(): void;
    get onUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
    get onPreUpdate(): Observable<{
        time: number;
        delta: number;
    }>;
}
