import { AnimationCode } from "../animations/animations";
import { Player } from "../player/player";
import { getAnimationForPlayer } from "./createAnimationsForPlayer";

export function playAnim(player: Player, anim: AnimationCode) {
  const key = getAnimationForPlayer(player, anim);
  if (player.view.anims.currentAnim?.key == key) return;
  player.view.play(key);
}
