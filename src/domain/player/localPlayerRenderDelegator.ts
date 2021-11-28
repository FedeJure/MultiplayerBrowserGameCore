import { Delegator } from "../delegator"
import { Player } from "./player"

export class LocalPlayerRenderDelegator implements Delegator {
    private readonly player: Player
    constructor(player: Player) {
        this.player = player
    }
    init(): void {
        this.player.view.scene.cameras.main.startFollow(this.player.view);
        this.player.view.scene.cameras.main.setZoom(2,2)
    }
    stop(): void {
    }
    update(time: number, delta: number): void {
    }

}