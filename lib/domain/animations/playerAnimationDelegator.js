"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnimationDelegator = void 0;
var createAnimationsForPlayer_1 = require("../actions/createAnimationsForPlayer");
var playAnimation_1 = require("../actions/playAnimation");
var serverPlayerAnimationDelegator_1 = require("./serverPlayerAnimationDelegator");
var PlayerAnimationDelegator = /** @class */ (function (_super) {
    __extends(PlayerAnimationDelegator, _super);
    function PlayerAnimationDelegator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerAnimationDelegator.prototype.init = function () {
        (0, createAnimationsForPlayer_1.setupPlayerAnimations)(this.player);
    };
    PlayerAnimationDelegator.prototype.stop = function () { };
    PlayerAnimationDelegator.prototype.update = function (time, delta) {
        var state = this.statesRepository.getPlayerState(this.player.info.id);
        if (state) {
            var currentAnim = this.getAnimation(state);
            (0, playAnimation_1.playAnim)(this.player, currentAnim);
        }
    };
    return PlayerAnimationDelegator;
}(serverPlayerAnimationDelegator_1.ServerPlayerAnimationDelegator));
exports.PlayerAnimationDelegator = PlayerAnimationDelegator;
