"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidePlayerFromDto = void 0;
var playerView_1 = require("../../view/playerView");
var playerConfiguration_1 = require("../playerConfiguration");
var clientProvider_1 = require("../../clientProvider");
function ProvidePlayerFromDto(dto, scene, local, input) {
    if (local === void 0) { local = false; }
    var view = new playerView_1.PlayerView(scene, dto.position.x, dto.position.y, playerConfiguration_1.DefaultConfiguration.height, playerConfiguration_1.DefaultConfiguration.width);
    var info = {
        name: dto.name,
        id: dto.id
    };
    clientProvider_1.ClientProvider.presenterProvider.forPlayer(view, local, input);
    return { view: view, info: info };
}
exports.ProvidePlayerFromDto = ProvidePlayerFromDto;
