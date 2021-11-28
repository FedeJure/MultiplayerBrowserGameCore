"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGame = void 0;
var gameEvents_1 = require("../infrastructure/events/gameEvents");
var providePlayerFromDto_1 = require("../domain/actions/providePlayerFromDto");
var ClientRenderDelegator_1 = require("../view/ClientRenderDelegator");
var ClientGame = /** @class */ (function () {
    function ClientGame(localPlayerId, coreProvider, socket, scene) {
        var _this = this;
        this.provider = coreProvider;
        this.socket = socket;
        this.scene = scene;
        this.localPlayerId = localPlayerId;
        this.render = new ClientRenderDelegator_1.ClientRenderDelegator();
        this.connectedPlayers = new Map();
        scene.onCreate.subscribe(function () {
            _this.listenEvents();
            socket.emit(gameEvents_1.GameEvents.PLAYER_CONNECTED.name, gameEvents_1.GameEvents.PLAYER_CONNECTED.getEvent(1));
        });
    }
    ClientGame.prototype.listenEvents = function () {
        var _this = this;
        this.socket.on(gameEvents_1.GameEvents.INITIAL_GAME_STATE.name, function (data) {
            console.log("[Client Game :: Initial Game State Event] ", data);
            var players = data.players.map(function (dto) {
                var player = providePlayerFromDto_1.ProvidePlayerFromDto(dto, _this.scene, _this.render);
                _this.connectedPlayers.set(player.info.id, player);
                return player;
            });
            _this.localPlayer = players.find(function (p) { return p.info.id == _this.localPlayerId; });
            _this.connectedPlayers.delete(_this.localPlayerId);
            _this.scene.addPlayers(players);
            if (_this.localPlayer)
                _this.render.renderLocalPlayer(_this.localPlayer.view);
        });
        this.socket.on(gameEvents_1.GameEvents.PLAYERS_POSITIONS.name, function (data) {
            data.positions.forEach(function (p) { var _a; return (_a = _this.connectedPlayers.get(p.id)) === null || _a === void 0 ? void 0 : _a.view.setPosition(p.position.x, p.position.y); });
        });
        this.socket.on(gameEvents_1.GameEvents.NEW_PLAYER_CONNECTED.name, function (dto) {
            var player = providePlayerFromDto_1.ProvidePlayerFromDto(dto, _this.scene, _this.render);
            _this.scene.addPlayers([player]);
        });
    };
    return ClientGame;
}());
exports.ClientGame = ClientGame;
