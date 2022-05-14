import * as Phaser from "phaser";

import { ClientProvider } from "./infrastructure/providers/clientProvider";
import { PhaserClientConfig } from "./infrastructure/configuration/PhaserGameConfigs";
import { SocketServerConnection } from "./infrastructure/socketServerConnection";
import { GameplayHud } from "./view/scenes/GameplayHud";
import { LocalPlayerRepository } from "./infrastructure/repositories/localPlayerRepository";
import { ClientLoadScene } from "./view/scenes/ClientLoadScene";
import { ClientGameScene } from "./view/scenes/ClientGameScene";
import { AssetsConfiguration } from "./infrastructure/configuration/AssetsConfiguration";
import { AssetLoader } from "./view/AssetLoader";
export const InitClientGame = (
  socket: any,
  localPlayerId: string,
  originUrl: string
) => {
  const connectionWithServer = new SocketServerConnection(socket);
  const hudScene = new GameplayHud(connectionWithServer);

  ClientProvider.Init(
    connectionWithServer,
    new LocalPlayerRepository(localPlayerId),
    originUrl,
    hudScene
  );
  const scene = new ClientGameScene(hudScene);
  const config = {
    ...PhaserClientConfig,
    scene: [new ClientLoadScene(), scene, hudScene],
  };
  const game = new Phaser.Game(config);
  AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);

  game.events.addListener(Phaser.Core.Events.READY, () => {
    ClientProvider.presenterProvider.forGameplay(scene);
  });
};
