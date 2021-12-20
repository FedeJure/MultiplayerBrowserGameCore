import { ProcessedMap } from "../../domain/environment/processedMap";
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
    getEvent: (
      players: PlayerInitialStateDto[],
      currentMap: ProcessedMap | undefined,
      neighborMaps: ProcessedMap[] | undefined
    ) => InitialGameStateEvent;
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
  MAP_UPDATE: {
    name: string;
    getEvent: (
      map: ProcessedMap,
      neighborMaps: ProcessedMap[]
    ) => MapUpdateEvent;
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
    getEvent: (players, currentMap, neighborMaps) => ({
      players,
      currentMap,
      neighborMaps,
      time: new Date(),
    }),
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
  MAP_UPDATE: {
    name: "map_update",
    getEvent: (newMap: ProcessedMap, neighborMaps: ProcessedMap[]) => ({
      time: new Date(),
      newMap,
      neighborMaps,
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
  currentMap: ProcessedMap | undefined;
  neighborMaps: ProcessedMap[] | undefined;
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

export interface MapUpdateEvent extends BaseEvent {
  newMap: ProcessedMap;
  neighborMaps: ProcessedMap[];
}
