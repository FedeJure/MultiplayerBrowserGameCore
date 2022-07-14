import { Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { ClientPlayerInput } from "../../domain/player/playerInput";
import { ButtonView } from "../../view/ui/ButtonView";
import { PlayerInputDto } from "../dtos/playerInputDto";

export class PlayerVirtualJoystickInput implements ClientPlayerInput {
  private joystickCursor;
  private jumpButton: ButtonView
  readonly _onInputChange = new Subject<void>();

  constructor(scene: Scene) {
    this.jumpButton = new ButtonView(scene.game.canvas.width - 120, scene.game.canvas.height - 120, 120,120, scene)
    const joystick = (scene.plugins.get("rexvirtualjoystickplugin") as any).add(
      this,
      {
        x: 200,
        y: scene.game.canvas.height - 150,
        radius: 200,
        base: scene.add.circle(
          200,
          scene.game.canvas.height - 150,
          100,
          0x888888
        ),
        thumb: scene.add.circle(
          200,
          scene.game.canvas.height - 150,
          50,
          0xcccccc
        ),
      }
    );

    this.joystickCursor = joystick.createCursorKeys();
    joystick.on('update', () => {
      this._onInputChange.next()
    })
    this.jumpButton.onChange.subscribe(() => {
      this._onInputChange.next()
    })
  }
  onInventoryChange = new Observable<void>();
  inventory = false;
  action = false;
  onAction = new Observable<void>();
  get up() {
    return this.joystickCursor.up.isDown as boolean;
  }
  get down() {
    return this.joystickCursor.down.isDown as boolean;
  }
  get left() {
    return this.joystickCursor.left.isDown as boolean;
  }
  get right() {
    return this.joystickCursor.right.isDown as boolean;
  }
  get jump() {
    return this.jumpButton.isDown;
  }
  get onInputChange() {
    return this._onInputChange.asObservable()
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
  get stats() {
    return false;
  }
  get menu() {
    return false;
  }
  get basicAttack() {
    return false;
  }
  get defend() {
    return false;
  }
  get skill1() {
    return false;
  }
  get skill2() {
    return false;
  }
  get skill3() {
    return false;
  }
  get skill4() {
    return false;
  }
}
