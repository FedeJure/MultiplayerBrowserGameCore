import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { PhaserEnemyView } from "../enemy/phaserEnemyView";
import { PhaserLadderView } from "../ladder/phaserLadderView";
import { PhaserPlayerView } from "../player/phaserPlayerView";

export class PhaserCollisionManager implements CollisionManager {
  private playerGroup: Phaser.Physics.Arcade.Group;
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private groundGroup: Phaser.Physics.Arcade.StaticGroup;
  private objectsGroup: Phaser.Physics.Arcade.StaticGroup;
  private laddersGroup: Phaser.Physics.Arcade.Group;
  private entrancesGroup: Phaser.Physics.Arcade.Group;
  private exitsGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Scene) {
    this.playerGroup = scene.physics.add.group({ allowRotation: false });
    this.enemyGroup = scene.physics.add.group({ allowRotation: false });
    this.groundGroup = scene.physics.add.staticGroup();
    this.objectsGroup = scene.physics.add.staticGroup();
    this.laddersGroup = scene.physics.add.group({
      allowGravity: false,
    });
    this.entrancesGroup = scene.physics.add.group({
      allowGravity: false,
    });

    this.exitsGroup = scene.physics.add.group({
      allowGravity: false,
    });

    scene.physics.add.collider(this.playerGroup, this.groundGroup);
    scene.physics.add.collider(this.enemyGroup, this.groundGroup);
    scene.physics.add.collider(this.objectsGroup, this.groundGroup);
    scene.physics.add.overlap(
      this.playerGroup,
      this.laddersGroup,
      (player: GameObjects.GameObject, ladder: GameObjects.GameObject) => {
        player.setData("inLadder", true);
        player.setData("ladder", ladder.getData('ladder'));
        return false;
      }
    );

    scene.physics.add.overlap(
      this.playerGroup,
      this.entrancesGroup,
      (player: GameObjects.GameObject, entrance: GameObjects.GameObject) => {
        player.setData("entrance", entrance.getData("entrance"));
        return false;
      }
    );

    scene.physics.add.overlap(
      this.playerGroup,
      this.exitsGroup,
      (player: GameObjects.GameObject, exit: GameObjects.GameObject) => {
        player.setData("exit", exit.getData("exit"));

        return false;
      }
    );
  }
  addEntrance(entrance: GameObjects.GameObject) {
    this.entrancesGroup.add(entrance);
  }
  addExit(exit: GameObjects.GameObject) {
    this.exitsGroup.add(exit);
  }
  addLadder(ladder: PhaserLadderView) {
    this.laddersGroup.add(ladder);
  }
  addObject(object: GameObjects.GameObject) {
    this.objectsGroup.add(object);
  }
  addPlayer(player: PhaserPlayerView) {
    this.playerGroup.add(player);
  }
  addEnemy(enemy: PhaserEnemyView) {
    this.enemyGroup.add(enemy);
  }
  addStaticGround(ground: GameObjects.GameObject) {
    this.groundGroup.add(ground);
  }
}
