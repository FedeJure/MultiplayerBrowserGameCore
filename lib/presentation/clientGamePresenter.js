"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGamePresenter = void 0;
var Logger_1 = require("../infrastructure/Logger");
var playerKeyboardInput_1 = require("../infrastructure/input/playerKeyboardInput");
var ClientGamePresenter = /** @class */ (function () {
    function ClientGamePresenter(localPlayerId, connection, scene, createClientPlayer, createLocalPlayer, playersRepository) {
        var _this = this;
        this.connection = connection;
        this.scene = scene;
        this.localPlayerId = localPlayerId;
        this.createClientPlayerAction = createClientPlayer;
        this.createLocalPlayerAction = createLocalPlayer;
        this.playersRepository = playersRepository;
        scene.onCreate.subscribe(function () {
            _this.listenEvents();
            connection.emitStartNewConnection(localPlayerId);
        });
    }
    ClientGamePresenter.prototype.listenEvents = function () {
        var _this = this;
        this.connection.onInitialGameState.subscribe(function (data) {
            (0, Logger_1.Log)(_this, "Initial Game State Event", data);
            data.players.forEach(function (dto) {
                if (dto.id === _this.localPlayerId)
                    _this.createLocalPlayerAction.execute(dto.info, dto.state, _this.scene, new playerKeyboardInput_1.PlayerKeyBoardInput(_this.scene.input.keyboard));
                else
                    _this.createClientPlayerAction.execute(dto.info, dto.state, _this.scene);
            });
            _this.connection.onNewPlayerConnected.subscribe(function (data) {
                if (_this.playersRepository.getPlayer(data.player.id))
                    return;
                _this.createClientPlayerAction.execute(data.player.info, data.player.state, _this.scene);
            });
            _this.connection.onPlayerDisconnected.subscribe(function (data) {
                _this.playersRepository.removePlayer(data.playerId);
            });
        });
    };
    return ClientGamePresenter;
}());
exports.ClientGamePresenter = ClientGamePresenter;
