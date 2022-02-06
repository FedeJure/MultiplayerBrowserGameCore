import { Scene } from "phaser";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { LocalPlayerRepository } from "../../infrastructure/repositories/localPlayerRepository";
import { ProcessedMap } from "../environment/processedMap";

export async function createBackgroundOnScene(
  map: ProcessedMap,
  scene: Scene,
  localPlayerRepository: LocalPlayerRepository,
  playersRepository: ConnectedPlayersRepository
) {
  
}
