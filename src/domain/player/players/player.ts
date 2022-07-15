import { Entity } from "../../entity/entity";
import { PlayerView } from "../../playerView";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class Player extends Entity<
  PlayerInfo,
  PlayerState,
  PlayerView,
  PlayerStats
> {}
