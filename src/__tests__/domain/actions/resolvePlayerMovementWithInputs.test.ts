import { expect, test, beforeEach } from "@jest/globals";
import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { ResolvePlayerMovementWithInputs } from "../../../domain/actions/resolvePlayerMovementWithInput";
import { PlayerInput } from "../../../domain/player/playerInput";
import { PlayerState } from "../../../domain/player/playerState";
import { PhaserPlayerView } from "../../../view/playerView";
import { PlayerInputDto } from "../../../infrastructure/dtos/playerInputDto";

let action: ResolvePlayerMovementWithInputs;

beforeEach(() => {
  action = new ResolvePlayerMovementWithInputs();
});

test("Game initted with provided player repository", () => {
  let input = givenAnInput();
  let view = givenAView();
  let state = givenAState();

  let finalState = whenActionExecuted(input, view, state);

  thenStateNotChange(state, finalState);
});

function whenActionExecuted(
  input: PlayerInput,
  view: PhaserPlayerView,
  state: PlayerState
) {
  return action.execute(input, view, state, 1);
}

function givenAnInput() {
  let input : PlayerInput = {
      left: false,
      right: false,
      jump: false,
      down: false,
      up: false,
      toDto: () => Substitute.for<PlayerInputDto>()
  }
  return input;
}

function givenAView() {
  return Substitute.for<PhaserPlayerView>();
}

function givenAState(): PlayerState {
  return ({
    life: 100,
    jumpsAvailable: 2,
    inInertia: false,
    position: {
      x: 0,
      y: 0,
    },
    velocity: { x: 0, y: 0 },
    canMove: true,
    canJump: true,
  });
}

function thenStateNotChange(state: PlayerState, finalState: PlayerState) {
    console.log(state, finalState)
  expect(state.jumpsAvailable == finalState.jumpsAvailable).toBe(true);
  expect(state.position.x == finalState.position.x).toBe(true);
  expect(state.velocity.x == finalState.velocity.x).toBe(true);
  expect(state.position.y == finalState.position.y).toBe(true);
  expect(state.velocity.y == finalState.velocity.y).toBe(true);
}
