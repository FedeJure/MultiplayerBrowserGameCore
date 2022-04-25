import { LocalClientPlayer } from "../../players/localClientPlayer";
import { ServerPlayer } from "../../players/serverPlayer";

export interface CombatAction {
    execute(player: LocalClientPlayer | ServerPlayer)
}