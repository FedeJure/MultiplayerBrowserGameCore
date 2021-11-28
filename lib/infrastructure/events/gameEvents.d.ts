import { PlayerState } from "../../domain/player/playerState";
import { PlayerInitialStateDto } from "../dtos/playerInitialStateDto";
import { PlayerInputDto } from "../dtos/playerInputDto";
export declare const GameEvents: {
    PLAYER_CONNECTED: {
        name: string;
        getEvent: (playerId: string) => PlayerConnectedEvent;
    };
    PLAYERS_STATES: {
        name: string;
        getEvent: (states: {
            [key: string]: PlayerState;
        }) => PlayerStatesEvent;
    };
    INITIAL_GAME_STATE: {
        name: string;
        getEvent: (players: PlayerInitialStateDto[]) => InitialGameStateEvent;
    };
    NEW_PLAYER_CONNECTED: {
        name: string;
        getEvent: (player: PlayerInitialStateDto) => NewPlayerConnectedEvent;
    };
    PLAYER_DISCONNECTED: {
        name: string;
        getEvent: (playerId: string) => PlayerDisconnectedEvent;
    };
    PLAYER_INPUT: {
        name: string;
        getEvent: (playerId: string, input: PlayerInputDto, inputNumber: number) => PlayerInputEvent;
    };
};
interface BaseEvent {
    time: Date;
}
export interface PlayerConnectedEvent extends BaseEvent {
    playerId: string;
}
export interface PlayerStatesEvent extends BaseEvent {
    states: {
        [key: string]: PlayerState;
    };
}
export interface InitialGameStateEvent extends BaseEvent {
    players: PlayerInitialStateDto[];
}
export interface NewPlayerConnectedEvent extends BaseEvent {
    player: PlayerInitialStateDto;
}
export interface PlayerDisconnectedEvent extends BaseEvent {
    playerId: string;
}
export interface PlayerInputEvent extends BaseEvent {
    playerId: string;
    input: PlayerInputDto;
    inputNumber: number;
}
export {};
