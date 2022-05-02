import { Scene } from "phaser";
import { MapEnvironmentObject } from "../../domain/environment/mapEnvironmentObject";
import { EnvironmentObjectFactory } from "../../domain/environmentObjects/environmentobjectFactory";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";

export class ServerEnvironmentObjectFactory
  implements EnvironmentObjectFactory
{
  constructor(
    private scene: Scene,
    private presenterProvider: ServerPresenterProvider
  ) {
    // For now we are using the client factory
    // WIP: find the way to load spine objects without waste memory
  }

  createObjects(objs: MapEnvironmentObject[]) {
    objs.forEach((ob) => {
      if (ob.object.objectVariant === EnvironmentObjectVariant.decorative)
        return;
      const view = this.scene.matter.add.sprite(
        ob.position.x,
        ob.position.y,
        "",
        undefined,
        {
          ignoreGravity: true,
          isStatic: true,
        }
      );

      view.setDisplaySize(ob.object.width, ob.object.height);
      view.setSize(ob.object.width, ob.object.height);
      const newPos = [view.x - view.width / 2, view.y - view.height / 2];
      view.setPosition(
        newPos[0] + view.width * ob.object.pivotOrigin.x,
        newPos[1] + view.height * ob.object.pivotOrigin.y
      );
      this.presenterProvider.forEnvironmentObject(ob.object, view);
    });
  }
}
