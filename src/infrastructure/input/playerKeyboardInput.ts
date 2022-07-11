import { Input } from "phaser";
import { ClientPlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { DefaultKeyboardControlConfig } from "./keyboardControlConfig";
import { ListenerableKey } from "./ListenerableKey";

interface KeyboardInput {
  up: ListenerableKey;
  down: ListenerableKey;
  left: ListenerableKey;
  right: ListenerableKey;
  jump: ListenerableKey;
  inventory: ListenerableKey;
  stats: ListenerableKey;
  menu: ListenerableKey;
  basicAttack: ListenerableKey;
  defend: ListenerableKey;
  action: ListenerableKey;
  skill1: Input.Keyboard.KeyCombo;
  skill2: Input.Keyboard.KeyCombo;
  skill3: Input.Keyboard.KeyCombo;
  skill4: Input.Keyboard.KeyCombo;
}
export class PlayerKeyBoardInput implements ClientPlayerInput {
  readonly input: KeyboardInput;

  constructor(inputPlugin: Input.Keyboard.KeyboardPlugin) {
    this.input = {
      up: new ListenerableKey(inputPlugin, DefaultKeyboardControlConfig.up),
      down: new ListenerableKey(inputPlugin, DefaultKeyboardControlConfig.down),
      left: new ListenerableKey(inputPlugin, DefaultKeyboardControlConfig.left),
      right: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.right
      ),
      jump: new ListenerableKey(inputPlugin, DefaultKeyboardControlConfig.jump),
      inventory: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.inventory
      ),
      stats: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.stats
      ),
      menu: new ListenerableKey(inputPlugin, DefaultKeyboardControlConfig.menu),
      basicAttack: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.basicAttack
      ),
      defend: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.defend
      ),
      action: new ListenerableKey(
        inputPlugin,
        DefaultKeyboardControlConfig.action
      ),
      skill1: inputPlugin.createCombo(
        DefaultKeyboardControlConfig.skill1.map((k) => inputPlugin.addKey(k)),
        { resetOnMatch: true }
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
    return this.input.up.key.isDown;
  }
  get down() {
    return this.input.down.key.isDown;
  }
  get left() {
    return this.input.left.key.isDown;
  }
  get right() {
    return this.input.right.key.isDown;
  }
  get jump() {
    return this.input.jump.key.isDown;
  }
  get inventory() {
    return this.input.inventory.key.isDown;
  }

  get stats() {
    return this.input.stats.key.isDown;
  }
  get menu() {
    return this.input.menu.key.isDown;
  }
  get basicAttack() {
    return this.input.basicAttack.key.isDown;
  }
  get defend() {
    return this.input.defend.key.isDown;
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

  get onInventoryChange() {
    return this.input.inventory.onKeyDown;
  }

  get action() {
    return this.input.action.key.isDown;
  }

  get onAction() {
    return this.input.action.onKeyDown
  }
}