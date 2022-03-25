import { Input } from "phaser";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";

export class PlayerKeyBoardInput implements PlayerInput {
  readonly input: {
    up: Input.Keyboard.Key;
    down: Input.Keyboard.Key;
    left: Input.Keyboard.Key;
    right: Input.Keyboard.Key;
    jump: Input.Keyboard.Key;
    inventory: Input.Keyboard.Key;
  };

  constructor(phaserInput: Input.Keyboard.KeyboardPlugin) {
    this.input = phaserInput.addKeys({
      up: Input.Keyboard.KeyCodes.W,
      down: Input.Keyboard.KeyCodes.S,
      left: Input.Keyboard.KeyCodes.A,
      right: Input.Keyboard.KeyCodes.D,
      jump: Input.Keyboard.KeyCodes.SPACE,
      inventory: Input.Keyboard.KeyCodes.I
    }) as {
      up: Input.Keyboard.Key;
      down: Input.Keyboard.Key;
      left: Input.Keyboard.Key;
      right: Input.Keyboard.Key;
      jump: Input.Keyboard.Key;
      inventory: Input.Keyboard.Key;
    };
  }
  toDto(): PlayerInputDto {
    return {
      up: this.up,
      down: this.down,
      left: this.left,
      right: this.right,
      jump: this.jump,
    };
  }

  get up() {
    return this.input.up.isDown;
  }
  get down() {
    return this.input.down.isDown;
  }
  get left() {
    return this.input.left.isDown;
  }
  get right() {
    return this.input.right.isDown;
  }
  get jump() {
    return this.input.jump.isDown;
  }
  get inventory() {
    return this.input.inventory.isDown
  }
}
