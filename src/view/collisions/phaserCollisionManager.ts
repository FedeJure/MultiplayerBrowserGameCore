import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { PhaserEnemyView } from "../enemy/phaserEnemyView";
import { PhaserPlayerView } from "../player/phaserPlayerView";

export class PhaserCollisionManager implements CollisionManager {
  private playerGroup: Phaser.Physics.Arcade.Group;
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private groundGroup: Phaser.Physics.Arcade.StaticGroup;
  constructor(scene: Scene) {
    this.playerGroup = scene.physics.add.group();
    this.enemyGroup = scene.physics.add.group();
    this.groundGroup = scene.physics.add.staticGroup();

    scene.physics.add.collider(this.playerGroup, this.groundGroup);
    scene.physics.add.collider(this.playerGroup, this.enemyGroup);
    scene.physics.add.collider(this.enemyGroup, this.groundGroup);
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
