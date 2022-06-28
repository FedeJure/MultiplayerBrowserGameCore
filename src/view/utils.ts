import { GameObjects, Scene } from "phaser";
import { Vector } from "../domain/vector";

export const loadAssetAsync = async (scene: Scene, func: () => boolean) => {
  return new Promise((res) => {
    const response = func();
    if (!response) {
      res(false);
      return;
    }
    scene.load.on("complete", res);
    scene.load.start();
  });
};

export function IsInsidePropertyOrRemove<
  T extends { position: Vector; height: number; width: number }
>(
  gameObject: GameObjects.GameObject & { x: number; y: number },
  key: string
): T | undefined {
  const container: T | undefined = gameObject.getData(key);
  if (!container) return undefined;
  const { x, y } = gameObject;
  const isInsideContainer = !(
    x < container.position.x ||
    y < container.position.y ||
    x > container.position.x + container.width ||
    y > container.position.y + container.height
  );
  if (container && !isInsideContainer) gameObject.setData(key, undefined);
  return isInsideContainer ? container : undefined;
}

export function jsonToGameObjects(
  scene: Scene,
  json: Phaser.Types.GameObjects.JSONGameObject[]
) {
  const createdObjects : GameObjects.GameObject[]= []
  json.forEach(object => {
    if (object.type && object.type === "Image") {
      createdObjects.push(scene.add
        .image(object.x, object.y, object.textureKey, object.frameKey)
        .setOrigin(object["origin.x"], object["origin.y"])
        .setScale((object.scale as Vector).x, (object.scale as Vector).y)
        .setRotation(object.rotation)
        .setDepth(object["depth"]));
    }
  })
  return createdObjects
  
}
