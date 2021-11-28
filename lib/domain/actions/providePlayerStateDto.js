"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidePlayerStateDto = void 0;
function ProvidePlayerStateDto(player) {
    return {
        id: player.info.id,
        name: player.info.name,
        position: { x: player.view.x, y: player.view.y },
        velocity: player.view.body.velocity,
        life: player.state.life,
        jumpsAvailable: player.state.jumpsAvailable,
        inInertia: player.state.inInertia,
        canMove: player.state.canMove
    };
}
exports.ProvidePlayerStateDto = ProvidePlayerStateDto;
