import { Delegator } from "../delegator"
import { Player } from "./player"

export class LocalPlayerRenderDelegator implements Delegator {
    private readonly player: Player
    constructor(player: Player) {
        this.player = player
    }
    init(): void {
        this.player.view.startFollowWithCam()
        this.player.view.scene.cameras.main.setZoom(4,4)
    }
    stop(): void {
    }
    update(time: number, delta: number): void {
    }

}