import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
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
    private connection: ServerConnection,
    private statesRepository: PlayerStateRepository,
    private originUrl: string
  ) {
    
  }
  init(): void {
    this.connection.onMapUpdated.subscribe(async (ev) => {
      await this.loadAssets([ev.newMap]);
      this.createMap([ev.newMap]);
      await this.loadAssets(ev.neighborMaps);
      this.createMap(ev.neighborMaps);
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  private async loadAssets(maps: ProcessedMap[]) {
    return new Promise<void>((res, _) => {
      this.scene.load.on("complete", () => res());
      maps.forEach((m) => {
        this.scene.load.image(
          m.config.backgroundFile.key,
          `${this.originUrl}/${DefaultGameConfiguration.getMapRootPath(
            m.id,
            m.layerId
          )}/${m.config.backgroundFile.fileName}`
        );
        this.scene.load.image(
          m.config.objectsSourceFile.key,
          `${this.originUrl}/${DefaultGameConfiguration.getMapRootPath(
            m.id,
            m.layerId
          )}/${m.config.objectsSourceFile.fileName}`
        );
        this.scene.load.image(
          m.config.tilesSourceFiles.key,
          `${this.originUrl}/${DefaultGameConfiguration.getMapRootPath(
            m.id,
            m.layerId
          )}/${m.config.tilesSourceFiles}`
        );
        this.scene.load.tilemapTiledJSON(
          m.config.jsonFile.key,
          `${this.originUrl}/${DefaultGameConfiguration.getMapRootPath(
            m.id,
            m.layerId
          )}/${m.config.jsonFile.fileName}`
        );
      });
    });
  }

  private createMap(maps: ProcessedMap[]) {
    maps.forEach((m) => {
      const tilemap = this.scene.make.tilemap({
        key: `map-${m.id}`,
      });
      tilemap.addTilesetImage(
        m.config.tilesSourceFiles.key,
        m.config.tilesSourceFiles.key
      );
      tilemap.addTilesetImage(
        m.config.objectsSourceFile.key,
        m.config.objectsSourceFile.key
      );
      tilemap.createLayer("ground", m.config.tilesSourceFiles.key);
      tilemap.createLayer("objects", m.config.objectsSourceFile.key);

      const colLayer = tilemap.getObjectLayer("colliders");
      colLayer.objects.forEach((obj) => {
        var sp: Phaser.Physics.Matter.Sprite | undefined;
        const pos = {
          x: (obj.x || 0) + m.originX,
          y: (obj.y || 0) + m.originY,
        };
        if (obj.rectangle) {
          const rec = new Phaser.GameObjects.Rectangle(
            this.scene,
            pos.x,
            pos.y,
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
            pos.x,
            pos.y,
            obj.polygon
          );
          pol.setPosition(
            pol.x + pol.displayOriginX,
            pol.y - pol.displayOriginY
          );
          sp = this.scene.matter.add.gameObject(pol, {
            vertices: obj.polygon,
            isStatic: true,
            friction: 0,
            angle: pol.rotation,
            restitution: 0,
            frictionAir: 0,
            ignoreGravity: true,
          }) as Phaser.Physics.Matter.Sprite;
          sp.setDisplayOrigin(0);
        }

        if (sp !== undefined) {
          sp.setBounce(0);
          sp.setFriction(0);
          sp.setCollisionCategory(CollisionCategory.StaticEnvironment);
          sp.setCollidesWith([
            CollisionCategory.Player,
            CollisionCategory.StaticEnvironment,
          ]);
        }
      });
    });
  }
}
