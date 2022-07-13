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
import { PhaserCollisionManager } from "./view/collisions/phaserCollisionManager";
import { BackgroundScene } from "./view/scenes/BackgroundScene";
import { isMobile } from "./view/utils";

export const InitClientGame = (
  socket: any,
  playerId: string,
  originUrl: string
) => {
  const connectionWithServer = new SocketServerConnection(socket);
  const hudScene = new GameplayHud(connectionWithServer);
  const bacgrkoundScene = new BackgroundScene();

  const scene = new ClientGameScene(hudScene);
  ClientProvider.Init(
    connectionWithServer,
    new LocalPlayerRepository(playerId),
    originUrl,
    hudScene
  );
  const config = {
    ...PhaserClientConfig,
    scene: [new ClientLoadScene(), scene, hudScene, bacgrkoundScene],
  };
  const game = new Phaser.Game(config);
  resizeGameWindow(game);
  if (isMobile()) {
    screen.orientation.addEventListener('change', function() {
      resizeGameWindow(game)
    });
    screen.orientation.lock("landscape");
  }
  window.addEventListener("resize", () => resizeGameWindow(game));
  AssetLoader.setBaseUrl(`${originUrl}${AssetsConfiguration.assetsPath}`);

  game.events.addListener(Phaser.Core.Events.READY, () => {
    ClientProvider.setCollisionManager(new PhaserCollisionManager(scene));
    ClientProvider.presenterProvider.forGameplay(scene);
  });
};

function resizeGameWindow(game: Phaser.Game) {
  var clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // clientWidth = isMobile() ? clientHeight * 0.9 : clientWidth;
  // clientHeight = isMobile() ? clientWidth * 0.9 : clientHeight;
  const gameHeight = 720;
  const gameWidth = 1280;
  const intendedZoom = clientWidth / gameWidth;
  const alternativeZoom = clientHeight / gameHeight;
  const useIntended = gameHeight * intendedZoom <= clientHeight;

  game.scale.resize(gameWidth, gameHeight);
  game.scale.setZoom(useIntended ? intendedZoom : alternativeZoom);
}
