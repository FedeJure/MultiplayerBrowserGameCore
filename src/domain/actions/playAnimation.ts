import { AnimationCode } from "../animations/animations";
import { Player } from "../player/player";
import { getAnimationForPlayer } from "./createAnimationsForPlayer";

export function playAnim(player: Player, anim: AnimationCode) {
  player.view.playAnimation(getAnimationForPlayer(player, anim))
}
