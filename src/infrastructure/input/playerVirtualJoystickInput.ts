import { Scene } from "phaser";
import { Observable } from "rxjs";
import { ClientPlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";

export class PlayerVirtualJoystickInput implements ClientPlayerInput {
  constructor(scene: Scene) {
    (scene.plugins.get("joystick") as any).add(this, {
      x: 55,
      y: 400,
      radius: 100,
      base: scene.add.circle(0, 0, 50, 0x888888),
      thumb: scene.add.circle(0, 0, 25, 0xcccccc),
    });
  }
  onInventoryChange: Observable<void>;
  inventory: boolean;
  action: boolean;
  onAction: Observable<void>;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  toDto(): PlayerInputDto {
    throw new Error("Method not implemented.");
  }
  stats: boolean;
  menu: boolean;
  basicAttack: boolean;
  defend: boolean;
  skill1: boolean;
  skill2: boolean;
  skill3: boolean;
  skill4: boolean;
}
