import mongoose from "mongoose";
import { EnemyStats } from "../../../domain/enemies/EnemyStats";
import { AnimationDto } from "../../../domain/entity/AnimationDto";
import { EntityInfo } from "../../../domain/entity/entityInfo";
import { EntityState } from "../../../domain/entity/entityState";
import { EntityStats } from "../../../domain/entity/entityStats";
import { Item } from "../../../domain/items/item";
import { PlayerInfo } from "../../../domain/player/playerInfo";
import { PlayerState } from "../../../domain/player/playerState";
import { Vector } from "../../../domain/vector";

export const EntityStatsType: mongoose.SchemaDefinition<EntityStats & {_id: String}> = {
  maxLife: Number,
  runSpeed: Number,
  walkSpeed: Number,
  jumpPower: Number,
  meleeDamage: Number,
  basicAttackSpeed: Number,
  meleeDistance: Number,
  rangedDistance: Number,
  level: Number,
};

export const EnemyStatsType: mongoose.SchemaDefinition<EnemyStats & {_id: String}> = {
  height: Number,
  width: Number,
  detectionRange: Number,
  ...EntityStatsType,
};

export const EntityInfoType: mongoose.SchemaDefinition<EntityInfo & {_id: String}> = {
  id: {required: true, type: String, unique: true},
  name: String,
};

export const PlayerInfoType: mongoose.SchemaDefinition<PlayerInfo & {_id: String}> = {
  ...EntityInfoType,
  accountId: String
};

export const ItemType: mongoose.SchemaDefinition<Item & {_id: String}> = {
  id: String,
  types: [String],
  icon: String,
  model: String,
  name: String,
  detail: String,
};

const VectorType: mongoose.SchemaDefinition<Vector & {_id: String}>= {
  x: Number,
  y: Number
}

const AnimationDtoType: mongoose.SchemaDefinition<AnimationDto & {_id: String}> = {
  name: String,
  layer: String,
  duration: {type: Number, required: false},
  loop:{type: Boolean, required: false},
  time: {type: Number, required: false}
}

export const EntityStateType: mongoose.SchemaDefinition<EntityState& {_id: String}> = {
  life: Number,
  position: VectorType,
  velocity: VectorType,
  anim: [AnimationDtoType],
  mapId: {required: true, type: Number},
  side: Number,
  grounded: Boolean,
  isAlive: Boolean,
  inLadder: Boolean,
}

export const PlayerStateType: mongoose.SchemaDefinition<PlayerState & {_id: String}> = {
  ...EntityStateType,
  jumpsAvailable: Number,
  inInertia: Boolean,
  canMove: Boolean,
  canJump: Boolean,
  inputNumber: Number,
  currentRooms:[String],
  jumping: Boolean,
  attacking: Boolean,
  exp: Number,
  transporting: Boolean,
  lastSpawnPoint: {
    default: Boolean,
    position: VectorType
  }
}