import { EnvironmentObjectAssetType } from "../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../domain/environmentObjects/environmentObjectVariant";
import { ServerProvider } from "../infrastructure/providers/serverProvider";

export const LoadServerRepositoriesWithMockData = async (provider: ServerProvider) => {
  //Mock players
  for (let i = 1; i <= 200; i++) {
    await provider.playerInfoRepository.save(i.toString(), {
      id: i.toString(),
      name: "Test Player " + i,
    });
  }

  // Load existent items
  await provider.itemsRepository.save("1", {
    id: "1",
    types: [],
    icon: "ui/testItem.png",
    model: "",
    name: "Default Test Item",
    detail: "This is a Test item used only for testing purpose",
  });
  await provider.itemsRepository.save("2", {
    id: "2",
    types: [],
    icon: "ui/testItem.png",
    model: "",
    name: "Ring of Honor",
    detail: "This is a Test item used only for testing purpose",
  });

  provider.environmentObjectsRepository.save({
    id: 1,
    pivotOrigin: { x: 0.5, y: 0 },
    height: 30,
    width: 30,
    textureName: "/objects/coin-pro",
    assetType: EnvironmentObjectAssetType.spine,
    objectVariant: EnvironmentObjectVariant.decorative,
  });
};
