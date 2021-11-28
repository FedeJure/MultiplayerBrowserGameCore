"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServerConnection = void 0;
var rxjs_1 = require("rxjs");
var gameEvents_1 = require("./events/gameEvents");
var socketIoEvents_1 = require("./events/socketIoEvents");
var SocketServerConnection = /** @class */ (function () {
    function SocketServerConnection(socket) {
        var _this = this;
        this._onInitialGameState = new rxjs_1.Subject();
        this._onNewPlayerConnected = new rxjs_1.Subject();
        this._onPlayersStates = new rxjs_1.Subject();
        this._onPlayerDisconnected = new rxjs_1.Subject();
        this._onPing = new rxjs_1.Subject();
        this.socket = socket;
        socket.on(gameEvents_1.GameEvents.INITIAL_GAME_STATE.name, function (data) {
            return _this._onInitialGameState.next(data);
        });
        socket.on(gameEvents_1.GameEvents.NEW_PLAYER_CONNECTED.name, function (data) {
            return _this._onNewPlayerConnected.next(data);
        });
        socket.on(gameEvents_1.GameEvents.PLAYERS_STATES.name, function (data) {
            return _this._onPlayersStates.next(data);
        });
        socket.on(gameEvents_1.GameEvents.PLAYER_DISCONNECTED.name, function (data) {
            return _this._onPlayerDisconnected.next(data);
        });
        var startTime = Date.now();
        socket.on(socketIoEvents_1.SocketIOEvents.PONG, function (data) {
            return _this._onPing.next(Date.now() - startTime);
        });
        setInterval(function () {
            startTime = Date.now();
            socket.emit(socketIoEvents_1.SocketIOEvents.PING);
        }, 2000);
    }
    Object.defineProperty(SocketServerConnection.prototype, "onInitialGameState", {
        get: function () {
            return this._onInitialGameState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketServerConnection.prototype, "onNewPlayerConnected", {
        get: function () {
            return this._onNewPlayerConnected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketServerConnection.prototype, "onPlayersStates", {
        get: function () {
            return this._onPlayersStates;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketServerConnection.prototype, "onPlayerDisconnected", {
        get: function () {
            return this._onPlayerDisconnected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketServerConnection.prototype, "onPing", {
        get: function () {
            return this._onPing;
        },
        enumerable: false,
        configurable: true
    });
    SocketServerConnection.prototype.emitStartNewConnection = function (playerId) {
        this.socket.emit(gameEvents_1.GameEvents.PLAYER_CONNECTED.name, gameEvents_1.GameEvents.PLAYER_CONNECTED.getEvent(playerId));
    };
    SocketServerConnection.prototype.emitInput = function (playerId, input, inputRequest) {
        this.socket.emit(gameEvents_1.GameEvents.PLAYER_INPUT.name, gameEvents_1.GameEvents.PLAYER_INPUT.getEvent(playerId, input, inputRequest));
    };
    return SocketServerConnection;
}());
exports.SocketServerConnection = SocketServerConnection;
