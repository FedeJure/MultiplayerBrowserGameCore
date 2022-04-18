import { EnvironmentObjectAssetType } from "../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../domain/environmentObjects/environmentObjectVariant";
import { ServerProvider } from "../infrastructure/providers/serverProvider";

export const LoadServerRepositoriesWithMockData = () => {

  //Mock players
  for (let i = 1; i <= 200; i++) {
    ServerProvider.playerInfoRepository.addPlayer(i.toString(), {
      id: i.toString(),
      name: "Test Player " + i,
    });
  }

  // Load existent items
  ServerProvider.itemsRepository.save({
    id: 1,
    types: [],
    icon: "ui/testItem.png",
    model: "",
    name: "Default Test Item",
    detail: "This is a Test item used only for testing purpose",
  });
  ServerProvider.itemsRepository.save({
    id: 2,
    types: [],
    icon: "ui/testItem.png",
    model: "",
    name: "Ring of Honor",
    detail: "This is a Test item used only for testing purpose",
  });

  ServerProvider.environmentObjectsRepository.save({
    id: 1,
    pivotOrigin: { x: 0.5, y: 0 },
    height: 30,
    width: 30,
    textureName: '/objects/coin-pro',
    assetType: EnvironmentObjectAssetType.spine,
    objectVariant: EnvironmentObjectVariant.decorative
  })
};
