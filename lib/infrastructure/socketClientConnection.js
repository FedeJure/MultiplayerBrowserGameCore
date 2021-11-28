"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClientConnection = void 0;
var rxjs_1 = require("rxjs");
var gameEvents_1 = require("./events/gameEvents");
var Logger_1 = require("./Logger");
var socketIoEvents_1 = require("./events/socketIoEvents");
var SocketClientConnection = /** @class */ (function () {
    function SocketClientConnection(socket) {
        var _this = this;
        this.onPlayerConnectionSubject = new rxjs_1.Subject();
        this.onInputSubject = new rxjs_1.Subject();
        this.onPlayerConnection = function () { return _this.onPlayerConnectionSubject; };
        this.connectionId = socket.id;
        this.connectionTime = new Date();
        this.socket = socket;
        this.listenEvents();
    }
    SocketClientConnection.prototype.onInput = function () {
        return this.onInputSubject;
    };
    SocketClientConnection.prototype.join = function (roomName) {
        this.socket.join(roomName);
    };
    SocketClientConnection.prototype.listenEvents = function () {
        var _this = this;
        this.socket.on(socketIoEvents_1.SocketIOEvents.PING, function () {
            _this.socket.emit(socketIoEvents_1.SocketIOEvents.PONG);
        });
        this.socket.on(gameEvents_1.GameEvents.PLAYER_CONNECTED.name, function (data) {
            try {
                var playerId = data.playerId;
                _this.onPlayerConnectionSubject.next({
                    playerId: playerId.toString(),
                });
            }
            catch (error) {
                (0, Logger_1.Log)(_this, "[Socket Client Connection] :: Error: ".concat(error));
            }
        });
        this.socket.on(gameEvents_1.GameEvents.PLAYER_INPUT.name, function (dto) {
            _this.onInputSubject.next(dto);
        });
    };
    SocketClientConnection.prototype.sendInitialStateEvent = function (players) {
        this.socket.emit(gameEvents_1.GameEvents.INITIAL_GAME_STATE.name, gameEvents_1.GameEvents.INITIAL_GAME_STATE.getEvent(players));
    };
    return SocketClientConnection;
}());
exports.SocketClientConnection = SocketClientConnection;
