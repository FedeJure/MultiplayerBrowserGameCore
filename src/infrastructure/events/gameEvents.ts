import { ProcessedMap } from "../../domain/environment/processedMap";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { Item } from "../../domain/items/item";
import { PlayerState } from "../../domain/player/playerState";
import { EnemyStatesDto } from "../dtos/enemyStatesDto";
import { LocalPlayerInitialStateDto } from "../dtos/localPlayerInitialStateDto";
import { PlayerInitialStateDto } from "../dtos/playerInitialStateDto";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { PlayerInventoryDto } from "../../domain/inventory/playerInventoryDto";
import { Loot } from "../../domain/loot/loot";
import { BalanceDto } from "../../domain/inventory/balanceDto";
import { Vector } from "../../domain/vector";

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
    getEvent: (
      inventory?: PlayerInventoryDto,
      balance?: BalanceDto
    ) => InventoryBalanceUpdatedEvent;
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
  LOOT_APPEAR: {
    name: string;
    getEvent: (loots: Loot[]) => LootsAppearEvent;
  };
  LOOT_DISAPPEAR: {
    name: string;
    getEvent: (loots: Loot[]) => LootsDisappearEvent;
  };
  CLAIM_LOOT: {
    name: string;
    getEvent: (
      lootId: Loot["id"],
      lootIndexes: number[],
      balance: number
    ) => ClaimLootEvent;
  };
  PLAYER_CONNECTION_RESPONSE: {
    name: string;
    getEvent: (
      success: boolean,
      message: string
    ) => PlayerConnectionResponseEvent;
  };
  POSITION_CHANGE: {
    name: string;
    getEvent: (position: Vector, tick: number) => PositionChangeEvent;
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
    getEvent: (newMap, neighborMaps) => ({
      time: new Date(),
      newMap,
      neighborMaps,
    }),
  },
  INVENTORY_UPDATED: {
    name: "inventory_updated",
    getEvent: (inventory, balance) => ({
      time: new Date(),
      inventory,
      balance,
    }),
  },
  ITEM_DETAILS: {
    name: "item_details",
    getEvent: (ids) => ({
      itemIds: ids,
      time: new Date(),
    }),
  },
  ITEM_DETAILS_RESPONSE: {
    name: "item_details_response",
    getEvent: (items) => ({
      items,
      time: new Date(),
    }),
  },
  ENVIRONMENT_OBJECT_DETAILS_REQUEST: {
    name: "environment_object_details_request",
    getEvent: (ids) => ({
      objectIds: ids,
      time: new Date(),
    }),
  },
  ENVIRONMENT_OBJECT_DETAILS_RESPONSE: {
    name: "environment_object_details_response",
    getEvent: (objects) => ({
      objects,
      time: new Date(),
    }),
  },
  ENEMIES_STATES: {
    name: "enemies_states_event",
    getEvent: (enemyStates) => ({
      enemyStates: enemyStates,
      time: new Date(),
    }),
  },
  LOOT_APPEAR: {
    name: "loote_appear",
    getEvent: (loots) => ({
      loots,
      time: new Date(),
    }),
  },
  LOOT_DISAPPEAR: {
    name: "loote_disappear",
    getEvent: (loots) => ({
      loots,
      time: new Date(),
    }),
  },
  CLAIM_LOOT: {
    name: "claim_loot",
    getEvent: (lootId, lootIndexes, balance) => ({
      lootId,
      lootIndexes,
      balance,
      time: new Date(),
    }),
  },
  PLAYER_CONNECTION_RESPONSE: {
    name: "player_connection_response",
    getEvent: (success, message) => ({
      success,
      message,
      time: new Date(),
    }),
  },
  POSITION_CHANGE: {
    name: "player_position_change",
    getEvent: (position, tick) => ({
      position,
      tick,
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

export interface PlayerConnectionResponseEvent extends BaseEvent {
  success: boolean;
  message: string;
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

export interface InventoryBalanceUpdatedEvent extends BaseEvent {
  inventory?: PlayerInventoryDto;
  balance?: BalanceDto;
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

export interface ClaimLootEvent extends BaseEvent {
  lootId: Loot["id"];
  lootIndexes: number[];
  balance: number;
}

export interface EnemiesStatesEvent extends BaseEvent {
  enemyStates: EnemyStatesDto;
}

export interface LootsAppearEvent extends BaseEvent {
  loots: Loot[];
}

export interface LootsDisappearEvent extends BaseEvent {
  loots: Loot[];
}

export interface PositionChangeEvent extends BaseEvent {
  position: Vector;
  tick: number;
}
