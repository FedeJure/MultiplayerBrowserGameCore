import { filter } from "rxjs";
import { Delegator } from "../domain/delegator";
import { Player } from "../domain/player/player";
import { ServerConnection } from "../domain/serverConnection";
import { IPlayerView } from "./playerView";

export class ClientPlayerPresenter {
  protected readonly view: IPlayerView;
  protected readonly player: Player;
  protected readonly connection: ServerConnection;
  private readonly delegators: Delegator[];

  constructor(
    connection: ServerConnection,
    player: Player,
    delegators: Delegator[]
  ) {
    this.view = player.view;
    this.player = player;
    this.connection = connection;
    this.delegators = delegators;

    this.connection.onPlayerDisconnected
      .pipe(filter((p) => p.playerId === player.info.id))
      .subscribe((_) => {
        delegators.forEach((d) => d.stop());
        player.view.destroy();
      });
    delegators.forEach((d) => d.init());
    this.view.onUpdate.subscribe((data) => {
      this.delegators.forEach((d) => d.update(data.time, data.delta));
    });
  }
}
