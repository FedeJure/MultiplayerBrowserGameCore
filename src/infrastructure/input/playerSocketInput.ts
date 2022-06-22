import { filter } from "rxjs";
import { ClientConnection } from "../../domain/clientConnection";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";

export class PlayerSocketInput implements PlayerInput {
  private _up: boolean = false;
  private _down: boolean = false;
  private _left: boolean = false;
  private _right: boolean = false;
  private _jump: boolean = false;
  private _stats: boolean = false;
  private _menu: boolean = false;
  private _basicAttack: boolean = false;
  private _defend: boolean = false;
  private _skill1: boolean = false;
  private _skill2: boolean = false;
  private _skill3: boolean = false;
  private _skill4: boolean = false;
  private _action: boolean = false;
  constructor(
    playerId: string,
    connection: ClientConnection,
    inputRequestRepository: PlayerInputRequestRepository
  ) {
    connection
      .onInput()
      .pipe(filter((ev) => ev.playerId === playerId))
      .subscribe((inputDto) => {
        this._up = inputDto.input.up;
        this._down = inputDto.input.down;
        this._left = inputDto.input.left;
        this._right = inputDto.input.right;
        this._jump = inputDto.input.jump;
        this._basicAttack = inputDto.input.basicAttack;
        this._defend = inputDto.input.defend;
        inputRequestRepository.set(playerId, inputDto.inputNumber);
      });
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
    return this._up;
  }
  get down() {
    return this._down;
  }
  get left() {
    return this._left;
  }
  get right() {
    return this._right;
  }
  get jump() {
    return this._jump;
  }
  get stats() {
    return this._stats;
  }
  get menu() {
    return this._menu;
  }
  get basicAttack() {
    return this._basicAttack;
  }
  get defend() {
    return this._defend;
  }
  get skill1() {
    return this._skill1;
  }
  get skill2() {
    return this._skill2;
  }
  get skill3() {
    return this._skill3;
  }
  get skill4() {
    return this._skill4;
  }

  get action() {
    return this._action;
  }
}
