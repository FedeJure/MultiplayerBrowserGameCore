export enum AnimationCode {
  IDLE = "idle",
  RUNNING = "run",
  IDLE_JUMP = "jump",
  RUNNING_JUMP = "jump",
  SECOND_JUMP = "jump",
  FALLING = "fall",
  BASIC_ATTACK = "attack",
  EMPTY_ANIMATION = "empty",
  TAKING_DAMAGE = "takingDamage",
  DEFEND = "defend",
  DIE = 'takingDamage'
}

export enum AnimationLayer {
  MOVEMENT = 0,
  COMBAT = 1,
}

export const AnimationLayers: AnimationLayer[] = [
  AnimationLayer.COMBAT,
  AnimationLayer.MOVEMENT,
];
