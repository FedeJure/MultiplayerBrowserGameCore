import { Player } from "../player/player";

export function getAnimationForPlayer(player: Player, anim: string) {
  return `${anim}`;
}
function createAnim(
  player: Player,
  startFrame: number,
  endFrame: number,
  key: string,
  loop = true,
  duration = 1
) {
  player.view.scene.anims.create({
    key: getAnimationForPlayer(player, key),
    frames: player.view.scene.anims.generateFrameNumbers("player_anim", {
      start: startFrame,
      end: endFrame,
    }),
    duration,
    repeat: loop ? -1 : 0,
  });
}

export function setupPlayerAnimations(player: Player) {
  // player.view.setTexture("player_anim");
  // createAnim(player, 0, 2, AnimationCode.IDLE, true, 1000);
  // createAnim(player, 8, 13, AnimationCode.RUNNING, true, 800);
  // createAnim(player, 15, 23, AnimationCode.IDLE_JUMP, false, 500);
  // createAnim(player, 15, 23, AnimationCode.RUNNING_JUMP, false, 500);
  // createAnim(player, 22, 23, AnimationCode.FALLING, true, 200);
}
