import { PlayerView } from "../../playerView";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";

export interface Player{
  get info(): PlayerInfo;
  get state(): PlayerState;
  get view(): PlayerView;
  update(time: number, delta: number);
  updateInfo(newInfo: Partial<PlayerInfo>);
  updateState(newState: Partial<PlayerState>);
  destroy();
}
