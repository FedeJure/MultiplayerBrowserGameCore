import { Input } from "phaser";

type KeyCode = number;
export interface KeyboardControlConfig {
  up: KeyCode;
  down: KeyCode;
  left: KeyCode;
  right: KeyCode;
  jump: KeyCode;
  inventory: KeyCode;
  stats: KeyCode;
  menu: KeyCode;
  basicAttack: KeyCode;
  defend: KeyCode;
  skill1: KeyCode[];
  skill2: KeyCode[];
  skill3: KeyCode[];
  skill4: KeyCode[];
}

export const DefaultKeyboardControlConfig: KeyboardControlConfig = {
  up: Input.Keyboard.KeyCodes.W,
  down: Input.Keyboard.KeyCodes.S,
  left: Input.Keyboard.KeyCodes.A,
  right: Input.Keyboard.KeyCodes.D,
  jump: Input.Keyboard.KeyCodes.SPACE,
  inventory: Input.Keyboard.KeyCodes.I,
  stats: Input.Keyboard.KeyCodes.C,
  menu: Input.Keyboard.KeyCodes.ESC,
  basicAttack: Input.Keyboard.KeyCodes.J,
  defend: Input.Keyboard.KeyCodes.K,
  skill1: [Input.Keyboard.KeyCodes.A, Input.Keyboard.KeyCodes.J],
  skill2: [Input.Keyboard.KeyCodes.D, Input.Keyboard.KeyCodes.J],
  skill3: [Input.Keyboard.KeyCodes.W, Input.Keyboard.KeyCodes.J],
  skill4: [Input.Keyboard.KeyCodes.S, Input.Keyboard.KeyCodes.J],
};
