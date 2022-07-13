import { Map } from "../../domain/environment/mapConfiguration";

export interface GameConfigurations {
  initialMapId: Map['id'];
  gameRate: 30 | 60 | 120
  playerStatesEventInterval: number
  lootDuration: number // in milliseconds
  lootDistance: number
  timeBetweenTransportations: number

}

export const DefaultGameConfiguration: GameConfigurations = {
  initialMapId: 1,
  gameRate: 60,
  playerStatesEventInterval: 17,
  lootDuration: 60000,
  lootDistance: 40,
  timeBetweenTransportations: 5000
};
