"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerCollisionDelegator = void 0;
var collisionTypes_1 = require("../../domain/collisions/collisionTypes");
var PlayerCollisionDelegator = /** @class */ (function () {
    function PlayerCollisionDelegator(collisionsDispatcher, view) {
        var _this = this;
        this.handlersMap = new Map();
        this.collisionsDispatcher = collisionsDispatcher;
        this.handlersMap.set(collisionTypes_1.CollisionCategory.StaticEnvironment, this.handleStaticEnvCollision);
        this.collisionsDispatcher.subscribeToStartCollision(view.matterBody.id)
            .subscribe(function (col) {
            var handler = _this.handlersMap.get(col.collidedCategory);
            if (handler)
                handler(col);
        });
    }
    PlayerCollisionDelegator.prototype.handleStaticEnvCollision = function (col) {
        console.log("ENV COLLISION", col);
    };
    return PlayerCollisionDelegator;
}());
exports.PlayerCollisionDelegator = PlayerCollisionDelegator;
