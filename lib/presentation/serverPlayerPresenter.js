"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPlayerPresenter = void 0;
var ServerPlayerPresenter = /** @class */ (function () {
    function ServerPlayerPresenter(player, input, resolveMovement, playerStates, delegators, inputRepository) {
        this.player = player;
        this.input = input;
        this.resolveMovement = resolveMovement;
        this.playerStates = playerStates;
        this.delegators = delegators;
        this.inputRepository = inputRepository;
        player.view.onUpdate.subscribe(this.update.bind(this));
        this.delegators.forEach(function (d) { return d.init(); });
    }
    ServerPlayerPresenter.prototype.update = function (_a) {
        var time = _a.time, delta = _a.delta;
        this.delegators.forEach(function (d) { return d.update(time, delta); });
        var oldState = this.playerStates.getPlayerState(this.player.info.id);
        if (oldState) {
            var newState = this.resolveMovement.execute(this.input, this.player.view, oldState, delta);
            this.playerStates.setPlayerState(this.player.info.id, __assign(__assign({}, newState), { inputNumber: this.inputRepository.getOrCreate(this.player.info.id) }));
            this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
        }
    };
    return ServerPlayerPresenter;
}());
exports.ServerPlayerPresenter = ServerPlayerPresenter;
