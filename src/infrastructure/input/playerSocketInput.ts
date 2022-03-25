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
        inputRequestRepository.set(playerId, inputDto.inputNumber);
      });
  }
  inventory: boolean = false;

  toDto(): PlayerInputDto {
    throw new Error("Method not implemented.");
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
}
