"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPresenterProvider = void 0;
var clientProvider_1 = require("../clientProvider");
var clientPlayerPresenter_1 = require("../presentation/clientPlayerPresenter");
var localPlayerPresenter_1 = require("../presentation/localPlayerPresenter");
var ClientPresenterProvider = /** @class */ (function () {
    function ClientPresenterProvider() {
    }
    ClientPresenterProvider.prototype.forLocalPlayer = function (view, input) {
        new localPlayerPresenter_1.LocalPlayerPresenter(view, input, clientProvider_1.ClientProvider.serverConnection);
    };
    ClientPresenterProvider.prototype.forPlayer = function (view) {
        new clientPlayerPresenter_1.ClientPlayerPresenter(view);
    };
    ClientPresenterProvider.prototype.forGameplay = function (scene) {
        // new ClientGamePresenter()
    };
    return ClientPresenterProvider;
}());
exports.ClientPresenterProvider = ClientPresenterProvider;
