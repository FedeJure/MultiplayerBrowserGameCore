import { PlayerState } from "../../domain/player/playerState";
import { PlayerInitialStateDto } from "../dtos/playerInitialStateDto";
import { PlayerInputDto } from "../dtos/playerInputDto";

export const GameEvents: {
  PLAYER_CONNECTED: {
    name: string;
    getEvent: (playerId: string) => PlayerConnectedEvent;
  };
  PLAYERS_STATES: {
    name: string;
    getEvent: (states: { [key: string]: PlayerState }) => PlayerStatesEvent;
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
    getEvent: (
      playerId: string,
      input: PlayerInputDto,
      inputNumber: number
    ) => PlayerInputEvent;
  };
} = {
  PLAYER_CONNECTED: {
    name: "player_connected",
    getEvent: (playerId) => ({ playerId, time: new Date() }),
  },
  PLAYERS_STATES: {
    name: "players_positions",
    getEvent: (states) => ({ states, time: new Date() }),
  },
  INITIAL_GAME_STATE: {
    name: "initial_game_state",
    getEvent: (players) => ({ players, time: new Date() }),
  },
  NEW_PLAYER_CONNECTED: {
    name: "new_player_connected",
    getEvent: (player) => ({ player, time: new Date() }),
  },
  PLAYER_DISCONNECTED: {
    name: "player_disconnected",
    getEvent: (playerId) => ({ playerId, time: new Date() }),
  },
  PLAYER_INPUT: {
    name: "player_input",
    getEvent: (playerId, input, inputNumber) => ({
      playerId,
      input,
      inputNumber,
      time: new Date(),
    }),
  },
};

interface BaseEvent {
  time: Date;
}

export interface PlayerConnectedEvent extends BaseEvent {
  playerId: string;
}

export interface PlayerStatesEvent extends BaseEvent {
  states: { [key: string]: PlayerState };
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
