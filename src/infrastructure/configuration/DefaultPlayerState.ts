import { AnimationCode } from "../../domain/animations/animations";
import { PlayerState } from "../../domain/player/playerState";
import { Side } from "../../domain/side";
import { DefaultGameConfiguration } from "./GameConfigurations";

export const DefaultPlayerState: PlayerState = {
  life: 100,
  jumpsAvailable: 2,
  inInertia: false,
  position: DefaultGameConfiguration.initialPosition,
  velocity: { x: 0, y: 0 },
  canMove: true,
  canJump: true,
  grounded: false,
  side: Side.RIGHT,
  inputNumber: 1,
  anim: AnimationCode.IDLE,
  map: { mapId: DefaultGameConfiguration.initialMapId },
  currentRooms: []
};
