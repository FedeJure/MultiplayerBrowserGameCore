import { Scene } from "phaser";
import { SocketServerConnection } from "../../infrastructure/socketServerConnection";
export declare class GameplayHud extends Scene {
    readonly connection: SocketServerConnection;
    pingText: Phaser.GameObjects.Text | undefined;
    fpsText: Phaser.GameObjects.Text | undefined;
    constructor(connection: SocketServerConnection);
    create(): void;
    update(): void;
    getPingText(ping: number): string;
    getFpsText(): string;
}
