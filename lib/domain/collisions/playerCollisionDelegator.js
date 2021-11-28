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
exports.PlayerCollisionDelegator = void 0;
var collisionTypes_1 = require("./collisionTypes");
var disposer_1 = require("../disposer");
var PlayerCollisionDelegator = /** @class */ (function () {
    function PlayerCollisionDelegator(player, collisionsDispatcher, statesRepository) {
        this.handlersMap = new Map();
        this.disposer = new disposer_1.Disposer();
        this.collisionsDispatcher = collisionsDispatcher;
        this.player = player;
        this.statesRepository = statesRepository;
        this.handlersMap.set([collisionTypes_1.CollisionCategory.StaticEnvironment, collisionTypes_1.CollisionType.Start].toString(), this.handleStaticEnvCollisionStart.bind(this));
        this.handlersMap.set([collisionTypes_1.CollisionCategory.StaticEnvironment, collisionTypes_1.CollisionType.End].toString(), this.handleStaticEnvCollisionEnd.bind(this));
    }
    PlayerCollisionDelegator.prototype.update = function (time, delta) {
    };
    PlayerCollisionDelegator.prototype.init = function () {
        var _this = this;
        this.disposer.add(this.collisionsDispatcher
            .subscribeToCollision(this.player.view.matterBody.id.toString())
            .subscribe(function (col) {
            var handler = _this.handlersMap.get([col.collidedCategory, col.type].toString());
            if (handler)
                handler(col);
        }));
    };
    PlayerCollisionDelegator.prototype.stop = function () {
        this.disposer.dispose();
    };
    PlayerCollisionDelegator.prototype.handleStaticEnvCollisionStart = function (col) {
        var state = this.statesRepository.getPlayerState(this.player.info.id);
        if (state)
            this.statesRepository.setPlayerState(this.player.info.id, __assign(__assign({}, state), { grounded: true }));
    };
    PlayerCollisionDelegator.prototype.handleStaticEnvCollisionEnd = function (col) {
        var state = this.statesRepository.getPlayerState(this.player.info.id);
        if (state)
            this.statesRepository.setPlayerState(this.player.info.id, __assign(__assign({}, state), { grounded: false }));
    };
    return PlayerCollisionDelegator;
}());
exports.PlayerCollisionDelegator = PlayerCollisionDelegator;
