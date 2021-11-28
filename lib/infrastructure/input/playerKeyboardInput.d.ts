import { Input } from "phaser";
import { PlayerInput } from "../../domain/player/playerInput";
import { PlayerInputDto } from "../dtos/playerInputDto";
export declare class PlayerKeyBoardInput implements PlayerInput {
    readonly input: {
        up: Input.Keyboard.Key;
        down: Input.Keyboard.Key;
        left: Input.Keyboard.Key;
        right: Input.Keyboard.Key;
        jump: Input.Keyboard.Key;
    };
    constructor(phaserInput: Input.Keyboard.KeyboardPlugin);
    toDto(): PlayerInputDto;
    get up(): boolean;
    get down(): boolean;
    get left(): boolean;
    get right(): boolean;
    get jump(): boolean;
}
