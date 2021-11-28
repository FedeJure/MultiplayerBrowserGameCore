import { Socket } from "socket.io";
export declare class GameSocketConnectionService {
    constructor(socket: Socket);
    private processPlayerConnected;
}
