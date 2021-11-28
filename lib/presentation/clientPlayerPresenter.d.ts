import { Delegator } from "../domain/delegator";
import { Player } from "../domain/player/player";
import { ServerConnection } from "../domain/serverConnection";
import { PhaserPlayerView } from "../view/playerView";
export declare class ClientPlayerPresenter {
    protected readonly view: PhaserPlayerView;
    protected readonly player: Player;
    protected readonly connection: ServerConnection;
    private readonly delegators;
    constructor(connection: ServerConnection, player: Player, delegators: Delegator[]);
    private renderPlayer;
}
