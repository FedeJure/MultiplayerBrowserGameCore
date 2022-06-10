import { ProcessedMap } from "../../domain/environment/processedMap";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { Item } from "../../domain/items/item";
import { PlayerState } from "../../domain/player/playerState";
import { EnemyStatesDto } from "../dtos/enemyStatesDto";
import { LocalPlayerInitialStateDto } from "../dtos/localPlayerInitialStateDto";
import { PlayerInitialStateDto } from "../dtos/playerInitialStateDto";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { PlayerInventory } from "../../domain/inventory/playerInventory";

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
      localPlayer: LocalPlayerInitialStateDto,
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
  INVENTORY_UPDATED: {
    name: string;
    getEvent: (inventory: PlayerInventory) => InventoryUpdatedEvent;
  };
  ITEM_DETAILS: {
    name: string;
    getEvent: (ids: Item["id"][]) => ItemDetailRequest;
  };
  ITEM_DETAILS_RESPONSE: {
    name: string;
    getEvent: (items: Item[]) => ItemDetailResponse;
  };
  ENVIRONMENT_OBJECT_DETAILS_REQUEST: {
    name: string;
    getEvent: (
      ids: EnvironmentObject["id"][]
    ) => EnvironmentObjectDetailsRequest;
  };
  ENVIRONMENT_OBJECT_DETAILS_RESPONSE: {
    name: string;
    getEvent: (
      objects: EnvironmentObject[]
    ) => EnvironmentObjectDetailsResponse;
  };
  ENEMIES_STATES: {
    name: string;
    getEvent: (enemyStates: EnemyStatesDto) => EnemiesStatesEvent;
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
    getEvent: (localPlayer, players, currentMap, neighborMaps) => ({
      localPlayer,
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
  INVENTORY_UPDATED: {
    name: "inventory_updated",
    getEvent: (inventory: PlayerInventory) => ({
      time: new Date(),
      inventory,
    }),
  },
  ITEM_DETAILS: {
    name: "item_details",
    getEvent: (ids: Item["id"][]) => ({
      itemIds: ids,
      time: new Date(),
    }),
  },
  ITEM_DETAILS_RESPONSE: {
    name: "item_details_response",
    getEvent: (items: Item[]) => ({
      items,
      time: new Date(),
    }),
  },
  ENVIRONMENT_OBJECT_DETAILS_REQUEST: {
    name: "environment_object_details_request",
    getEvent: (ids: EnvironmentObject["id"][]) => ({
      objectIds: ids,
      time: new Date(),
    }),
  },
  ENVIRONMENT_OBJECT_DETAILS_RESPONSE: {
    name: "environment_object_details_response",
    getEvent: (objects: EnvironmentObject[]) => ({
      objects,
      time: new Date(),
    }),
  },
  ENEMIES_STATES: {
    name: "enemies_states_event",
    getEvent: (enemyStates: EnemyStatesDto) => ({
      enemyStates: enemyStates,
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
  localPlayer: LocalPlayerInitialStateDto;
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

export interface InventoryUpdatedEvent extends BaseEvent {
  inventory: PlayerInventory;
}

export interface ItemDetailRequest extends BaseEvent {
  itemIds: Item["id"][];
}

export interface ItemDetailResponse extends BaseEvent {
  items: Item[];
}

export interface EnvironmentObjectDetailsResponse extends BaseEvent {
  objects: EnvironmentObject[];
}

export interface EnvironmentObjectDetailsRequest extends BaseEvent {
  objectIds: EnvironmentObject["id"][];
}

export interface EnemiesStatesEvent extends BaseEvent {
  enemyStates: EnemyStatesDto;
}
