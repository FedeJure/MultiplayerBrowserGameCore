"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRoomConnection = void 0;
var SocketRoomConnection = /** @class */ (function () {
    function SocketRoomConnection(socket, roomName) {
        this.roomName = roomName;
        this.socket = socket;
    }
    SocketRoomConnection.prototype.join = function (connection) {
        connection.join(this.roomName);
    };
    SocketRoomConnection.prototype.emit = function (eventName, data) {
        this.socket.to(this.roomName).emit(eventName, data);
    };
    return SocketRoomConnection;
}());
exports.SocketRoomConnection = SocketRoomConnection;
