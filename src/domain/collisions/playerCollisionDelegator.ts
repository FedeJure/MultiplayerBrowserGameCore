import { CollisionsDispatcher } from "./collisionsDispatcher";
import { CollisionCategory, CollisionType } from "./collisionTypes";
import { CollisionData } from "./collisionData";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Player } from "../player/player";

export class PlayerCollisionDelegator implements Delegator {
  private readonly collisionsDispatcher: CollisionsDispatcher;
  private readonly player: Player;
  private readonly statesRepository: PlayerStateRepository;

  private readonly handlersMap: Map<string, (col: CollisionData) => void> =
    new Map();
  private readonly disposer: Disposer = new Disposer();

  constructor(
    player: Player,
    collisionsDispatcher: CollisionsDispatcher,
    statesRepository: PlayerStateRepository
  ) {
    this.collisionsDispatcher = collisionsDispatcher;
    this.player = player;
    this.statesRepository = statesRepository;
    this.handlersMap.set(
      [CollisionCategory.StaticEnvironment, CollisionType.Start].toString(),
      this.handleStaticEnvCollisionStart.bind(this)
    );
    this.handlersMap.set(
      [CollisionCategory.StaticEnvironment, CollisionType.End].toString(),
      this.handleStaticEnvCollisionEnd.bind(this)
    );
  }
  update(time: number, delta: number): void {}

  init(): void {
    this.disposer.add(
      this.collisionsDispatcher
        .subscribeToCollision(this.player.view.matterBody.id.toString())
        .subscribe((col) => {
          const handler = this.handlersMap.get(
            [col.collidedCategory, col.type].toString()
          );
          if (handler) handler(col);
        })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }

  private handleStaticEnvCollisionStart(col: CollisionData) {
    if (Math.abs(col.tangent.y) !== 0) return;
    const state = this.statesRepository.getPlayerState(this.player.info.id);

    if (state && !state.grounded)
      this.statesRepository.setPlayerState(this.player.info.id, {
        ...state,
        grounded: true,
      });
  }

  private handleStaticEnvCollisionEnd(col: CollisionData) {
    // if (Math.abs(col.tangent.y) !== 0) return
    const state = this.statesRepository.getPlayerState(this.player.info.id);
    if (state)
      this.statesRepository.setPlayerState(this.player.info.id, {
        ...state,
        grounded: false,
      });
  }
}
