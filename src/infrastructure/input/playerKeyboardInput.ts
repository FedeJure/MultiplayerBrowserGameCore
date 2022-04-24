import { Input } from "phaser";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { DefaultKeyboardControlConfig } from "./keyboardControlConfig";
interface KeyboardInput {
  up: Input.Keyboard.Key;
  down: Input.Keyboard.Key;
  left: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  jump: Input.Keyboard.Key;
  inventory: Input.Keyboard.Key;
  stats: Input.Keyboard.Key;
  menu: Input.Keyboard.Key;
  basicAttack: Input.Keyboard.Key;
  defend: Input.Keyboard.Key;
  skill1: Input.Keyboard.KeyCombo;
  skill2: Input.Keyboard.KeyCombo;
  skill3: Input.Keyboard.KeyCombo;
  skill4: Input.Keyboard.KeyCombo;
}
export class PlayerKeyBoardInput implements PlayerInput {
  readonly input: KeyboardInput;

  constructor(private inputPlugin: Input.Keyboard.KeyboardPlugin) {
    this.input = {
      up: inputPlugin.addKey(DefaultKeyboardControlConfig.up),
      down: inputPlugin.addKey(DefaultKeyboardControlConfig.down),
      left: inputPlugin.addKey(DefaultKeyboardControlConfig.left),
      right: inputPlugin.addKey(DefaultKeyboardControlConfig.right),
      jump: inputPlugin.addKey(DefaultKeyboardControlConfig.jump),
      inventory: inputPlugin.addKey(DefaultKeyboardControlConfig.inventory),
      stats: inputPlugin.addKey(DefaultKeyboardControlConfig.stats),
      menu: inputPlugin.addKey(DefaultKeyboardControlConfig.menu),
      basicAttack: inputPlugin.addKey(DefaultKeyboardControlConfig.basicAttack),
      defend: inputPlugin.addKey(DefaultKeyboardControlConfig.defend),
      skill1: inputPlugin.createCombo(
        DefaultKeyboardControlConfig.skill1.map((k) => inputPlugin.addKey(k)), {resetOnMatch: true}
      ),
      skill2: inputPlugin.createCombo(
        DefaultKeyboardControlConfig.skill2.map((k) => inputPlugin.addKey(k))
      ),
      skill3: inputPlugin.createCombo(
        DefaultKeyboardControlConfig.skill3.map((k) => inputPlugin.addKey(k))
      ),
      skill4: inputPlugin.createCombo(
        DefaultKeyboardControlConfig.skill4.map((k) => inputPlugin.addKey(k))
      ),
    };
  }
  toDto(): PlayerInputDto {
    return {
      up: this.up,
      down: this.down,
      left: this.left,
      right: this.right,
      jump: this.jump,
      basicAttack: this.basicAttack,
      defend: this.defend,
      skill1: this.skill1,
      skill2: this.skill2,
      skill3: this.skill3,
      skill4: this.skill4,
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
    return this.input.inventory.isDown;
  }

  get stats() {
    return this.input.stats.isDown;
  }
  get menu() {
    return this.input.menu.isDown;
  }
  get basicAttack() {
    return this.input.basicAttack.isDown;
  }
  get defend() {
    return this.input.defend.isDown;
  }
  get skill1() {
    return this.input.skill1.matched;
  }
  get skill2() {
    return this.input.skill2.matched;
  }
  get skill3() {
    return this.input.skill3.matched;
  }
  get skill4() {
    return this.input.skill4.matched;
  }
}
