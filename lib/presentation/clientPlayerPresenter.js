"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPlayerPresenter = void 0;
var rxjs_1 = require("rxjs");
var ClientPlayerPresenter = /** @class */ (function () {
    function ClientPlayerPresenter(connection, player, delegators) {
        var _this = this;
        this.view = player.view;
        this.player = player;
        this.connection = connection;
        this.delegators = delegators;
        this.renderPlayer(this.view);
        this.connection.onPlayerDisconnected
            .pipe((0, rxjs_1.filter)(function (p) { return p.playerId === player.info.id; }))
            .subscribe(function (_) {
            delegators.forEach(function (d) { return d.stop(); });
            player.view.destroy();
        });
        delegators.forEach(function (d) { return d.init(); });
        this.view.onUpdate.subscribe(function (data) {
            return _this.delegators.forEach(function (d) {
                return d.update(data.time, data.delta);
            });
        });
    }
    ClientPlayerPresenter.prototype.renderPlayer = function (player) {
        player.scene.add.existing(player);
    };
    return ClientPlayerPresenter;
}());
exports.ClientPlayerPresenter = ClientPlayerPresenter;
