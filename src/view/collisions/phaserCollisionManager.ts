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
  private antiLadderGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Scene) {
    this.playerGroup = scene.physics.add.group();
    this.enemyGroup = scene.physics.add.group();
    this.groundGroup = scene.physics.add.staticGroup();
    this.objectsGroup = scene.physics.add.staticGroup();
    this.laddersGroup = scene.physics.add.group({
      allowGravity: false,
    });
    this.antiLadderGroup = scene.physics.add.group({
      allowGravity: false,
    });

    scene.physics.add.collider(this.playerGroup, this.groundGroup);
    scene.physics.add.collider(this.enemyGroup, this.groundGroup);
    scene.physics.add.collider(this.objectsGroup, this.groundGroup);
    scene.physics.add.overlap(
      this.playerGroup,
      this.laddersGroup,
      (player: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        player.setData("inLadder", true);
        return false;
      }
    );

    scene.physics.add.overlap(
      this.playerGroup,
      this.antiLadderGroup,
      (player: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        player.setData("inLadder", false);
        return false;
      }
    );
  }
  addLadder(ladder: PhaserLadderView) {
    this.laddersGroup.add(ladder);
  }

  addAntiLadder(ladder: GameObjects.Rectangle) {
    this.antiLadderGroup.add(ladder);
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
