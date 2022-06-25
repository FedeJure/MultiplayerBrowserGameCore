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
>(gameObject: GameObjects.GameObject & { x: number; y: number }, key: string): T | undefined {
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
