import { EnvironmentObjectAssetType } from "../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../domain/environmentObjects/environmentObjectVariant";
import { ItemType } from "../domain/items/itemType";
import { ServerProvider } from "../infrastructure/providers/serverProvider";

export const LoadServerRepositoriesWithMockData = async (
  provider: ServerProvider
) => {
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
    types: [ItemType.QUEST],
    icon: "ui/testItem.png",
    model: "",
    name: "Default Test Item",
    detail: "This is a Test item used only for testing purpose",
  });
  await provider.itemsRepository.save("2", {
    id: "2",
    types: [ItemType.ARMOR_EQUIPMENT, ItemType.QUEST],
    icon: "ui/testItem.png",
    model: "",
    name: "Ring of Honor",
    detail: "This is a Test item used only for testing purpose",
  });

  await provider.lootConfigurationRepository.save("simpleLoot", {
    id: "simpleLoot",
    items: [{ itemId: "1", probability: 0.2 }, { itemId: "2", probability: 0.2 }],
    minMoney: { copper: 50 },
    maxMoney: { silver: 1, copper: 50 },
    minItems: 0,
    maxItems: 2
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
