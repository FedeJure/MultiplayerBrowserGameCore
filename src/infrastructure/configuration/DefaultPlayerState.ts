import {
  EntityAnimationCode,
  AnimationLayer,
} from "../../domain/entity/animations";
import { PlayerState } from "../../domain/player/playerState";
import { Side } from "../../domain/side";
import { DefaultGameConfiguration } from "./GameConfigurations";

export const DefaultPlayerState: PlayerState = {
  life: 100,
  jumpsAvailable: 2,
  inInertia: false,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  canMove: true,
  canJump: true,
  grounded: false,
  side: Side.RIGHT,
  inputNumber: 1,
  anim: [{ name: EntityAnimationCode.IDLE, layer: AnimationLayer.MOVEMENT }],
  mapId: DefaultGameConfiguration.initialMapId,
  currentRooms: [],
  jumping: false,
  attacking: false,
  isAlive: true,
  exp: 0,
  transporting: false,
  inLadder: false,
  lastSpawnPoint: { default: false, position: { x: 0, y: 0 } }
};
