"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEvents = void 0;
exports.GameEvents = {
    PLAYER_CONNECTED: {
        name: "player_connected",
        getEvent: function (playerId) { return ({ playerId: playerId, time: new Date() }); },
    },
    PLAYERS_STATES: {
        name: "players_positions",
        getEvent: function (states) { return ({ states: states, time: new Date() }); },
    },
    INITIAL_GAME_STATE: {
        name: "initial_game_state",
        getEvent: function (players) { return ({ players: players, time: new Date() }); },
    },
    NEW_PLAYER_CONNECTED: {
        name: "new_player_connected",
        getEvent: function (player) { return ({ player: player, time: new Date() }); },
    },
    PLAYER_DISCONNECTED: {
        name: "player_disconnected",
        getEvent: function (playerId) { return ({ playerId: playerId, time: new Date() }); },
    },
    PLAYER_INPUT: {
        name: "player_input",
        getEvent: function (playerId, input, inputNumber) { return ({
            playerId: playerId,
            input: input,
            inputNumber: inputNumber,
            time: new Date(),
        }); },
    },
};
