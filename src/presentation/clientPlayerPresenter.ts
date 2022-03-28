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
  }
}
