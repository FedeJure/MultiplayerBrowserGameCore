import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientGameScene } from "../../view/scenes/ClientGameScene";
import { CollisionCategory } from "../collisions/collisionTypes";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { ProcessedMap } from "./processedMap";

export class CurrentMapDelegator implements Delegator {
  public constructor(
    private scene: ClientGameScene,
    private localPlayerId: string,
    connection: ServerConnection,
    private statesRepository: PlayerStateRepository
  ) {
    connection.onMapUpdated.subscribe((ev) => {
      this.createMap(ev.newMap, ev.neighborMaps)
    });
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {}

  private createMap(newMap: ProcessedMap, neighborMaps: ProcessedMap[]) {
    const map = this.scene.make.tilemap({
      key: "level1",
    });
    const tileset = map.addTilesetImage("ground", "ground");
    const village = map.addTilesetImage("village", "village");

    map.createLayer("background", village);
    map.createLayer("background1", village);
    map.createLayer("solid", tileset);
    const objLayer = map.getObjectLayer("colliders");
    objLayer.objects.forEach((obj) => {
      var sp: Phaser.Physics.Matter.Sprite | undefined;
      if (obj.rectangle) {
        const rec = new Phaser.GameObjects.Rectangle(
          this.scene,
          obj.x || 0,
          obj.y || 0,
          obj.width,
          obj.height
        );
          
        sp = this.scene.matter.add.gameObject(rec, {
          isStatic: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setPosition(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.angle += obj.rotation || 0;
        sp.setOrigin(0, 0);
      }

      if (obj.polygon) {
        const pol = new Phaser.GameObjects.Polygon(
          this.scene,
          (obj.x || 0 ),
          (obj.y || 0),
          obj.polygon
        );
        pol.setPosition(pol.x + pol.displayOriginX, pol.y - pol.displayOriginY)
        sp = this.scene.matter.add.gameObject(pol, {
          vertices: obj.polygon,
          isStatic: true,
          friction: 0,
          angle: pol.rotation,
          restitution: 0,
          frictionAir: 0,
          ignoreGravity: true,
        }) as Phaser.Physics.Matter.Sprite;
        sp.setDisplayOrigin(0)
      }
      

      if (sp !== undefined) {
        sp.setBounce(0)
        sp.setFriction(0);
        sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
        sp.setCollidesWith([
          CollisionCategory.Player,
          CollisionCategory.StaticEnvironment,
        ]);
      }
    });
  }
}
