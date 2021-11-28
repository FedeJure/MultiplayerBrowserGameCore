import { AnimationCode } from "../../domain/animations/animations";
import { PlayerState } from "../../domain/player/playerState";
import { Side } from "../../domain/side";

export const DefaultPlayerState: PlayerState = {
    life: 100,
    jumpsAvailable: 2,
    inInertia: false,
    position: { x: 100, y: 0 },
    velocity: { x: 0, y: 0 },
    canMove: true,
    canJump: true,
    grounded: false,
    side: Side.RIGHT,
    inputNumber: 1,
    anim: AnimationCode.IDLE
  }