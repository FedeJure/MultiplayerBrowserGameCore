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
exports.LocalPlayerPresenter = void 0;
var clientPlayerPresenter_1 = require("./clientPlayerPresenter");
var LocalPlayerPresenter = /** @class */ (function (_super) {
    __extends(LocalPlayerPresenter, _super);
    function LocalPlayerPresenter(view, input, connection, resolveMovement, player, validateState, playerStateRepository, delegators) {
        var _this = _super.call(this, view, connection, player, validateState) || this;
        _this.lastInputSended = "";
        _this.input = input;
        _this.resolveMovement = resolveMovement;
        _this.playerStateRepository = playerStateRepository;
        _this.delegators = delegators;
        _this.renderLocalPlayer();
        view.onUpdate.subscribe(_this.update.bind(_this));
        delegators.forEach(function (d) { return d.init(); });
        return _this;
    }
    LocalPlayerPresenter.prototype.renderLocalPlayer = function () {
        this.view.scene.cameras.main.startFollow(this.view);
    };
    LocalPlayerPresenter.prototype.update = function (_a) {
        var time = _a.time, delta = _a.delta;
        var currentInput = this.input.toDto();
        this.currentInput = currentInput;
        if (this.inputHasChange()) {
            this.connection.emitInput(this.player.info.id, currentInput);
            var oldState = this.playerStateRepository.getPlayerState(this.player.info.id);
            if (oldState) {
                var newState = this.resolveMovement.execute(this.input, this.view, oldState, delta);
                this.view.setVelocity(newState.velocity.x, newState.velocity.y);
                this.playerStateRepository.setPlayerState(this.player.info.id, newState);
            }
            this.lastInputSended = JSON.stringify(currentInput);
        }
    };
    LocalPlayerPresenter.prototype.inputHasChange = function () {
        return (!this.lastInputSended ||
            JSON.stringify(this.currentInput) != this.lastInputSended);
    };
    return LocalPlayerPresenter;
}(clientPlayerPresenter_1.ClientPlayerPresenter));
exports.LocalPlayerPresenter = LocalPlayerPresenter;
