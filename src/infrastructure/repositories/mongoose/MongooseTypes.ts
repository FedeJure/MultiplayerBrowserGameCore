import mongoose from "mongoose";
import { EnemyStats } from "../../../domain/enemies/EnemyStats";
import { EntityInfo } from "../../../domain/entity/entityInfo";
import { EntityStats } from "../../../domain/entity/entityStats";
import { Item } from "../../../domain/items/item";

export const EntityStatsType: mongoose.SchemaDefinition<EntityStats> = {
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

export const EnemyStatsType: mongoose.SchemaDefinition<EnemyStats> = {
  height: Number,
  width: Number,
  detectionRange: Number,
  ...EntityStatsType,
};

export const EntityInfoType: mongoose.SchemaDefinition<EntityInfo> = {
  id: String,
  name: String,
};

export const ItemType: mongoose.SchemaDefinition<Item> = {
  id: String,
  types: [String],
  icon: String,
  model: String,
  name: String,
  detail: String,
};
