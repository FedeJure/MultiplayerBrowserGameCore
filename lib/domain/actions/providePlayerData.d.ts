import { Player } from "../../domain/player";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { GameScene } from "../../view/GameScene";
import { RenderDelegator } from "../../view/RenderDelegator";
export declare function ProvidePlayerData(playerId: number, playerInfoRepository: PlayerInfoRepository, playerStateRepository: PlayerStateRepository, scene: GameScene, render: RenderDelegator): Player;
