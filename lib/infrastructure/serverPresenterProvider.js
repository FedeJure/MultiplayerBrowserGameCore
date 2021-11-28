"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPresenterProvider = void 0;
var serverPlayerPresenter_1 = require("../presentation/serverPlayerPresenter");
var ServerPresenterProvider = /** @class */ (function () {
    function ServerPresenterProvider() {
    }
    ServerPresenterProvider.prototype.forPlayer = function (view, input) {
        new serverPlayerPresenter_1.ServerPlayerPresenter(view, input);
    };
    return ServerPresenterProvider;
}());
exports.ServerPresenterProvider = ServerPresenterProvider;
