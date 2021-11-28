import { PlayerStateDto } from "../../infrastructure/dtos/playerStateDTO";
import { GameScene } from "../../view/scenes/GameScene";
import { PlayerFacade } from "../playerFacade";
import { PlayerInput } from "../playerInput";
export declare function ProvidePlayerFromDto(dto: PlayerStateDto, scene: GameScene, local?: boolean, input?: PlayerInput): PlayerFacade;
