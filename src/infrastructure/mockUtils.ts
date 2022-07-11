import { SpiderEnemyModel } from "../domain/enemies/enemyModel/spiderEnemyModel";
import { EnvironmentObjectAssetType } from "../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../domain/environmentObjects/environmentObjectVariant";
import { ItemType } from "../domain/items/itemType";
import { ServerProvider } from "../infrastructure/providers/serverProvider";

export const LoadServerRepositoriesWithMockData = async (
  provider: ServerProvider
) => {
  //Mock player

  // for (let i = 1; i <= 200; i++) {
  //   await provider.playerInfoRepository.save(i.toString(), {
  //     id: i.toString(),
  //     name: "Test Player " + i,
  //   });
  // }

  const accountId = "f1718a6b115948f9b07a901d";
  if (!(await provider.accountRepository.get(accountId))) {
    await provider.accountRepository.save(accountId, {
      id: accountId,
      email: "asd",
      hashedPassword:
        "$2b$10$wxXsqcb7zaE0RAoay19SIOaxFIA0jDYWHTHHOTSvtTuU2KabYVwjC", //asd
      creationDate: 1657159261664,
    });
    let playerId = provider.playerInfoRepository.getId();
    await provider.playerInfoRepository.save(playerId, {
      id: playerId,
      name: "Test Player",
      accountId: accountId,
    });
  }

  const anotherAccountId = "f1718a6b115948f9b07a901f";

  if (!(await provider.accountRepository.get(anotherAccountId))) {
    await provider.accountRepository.save(anotherAccountId, {
      id: anotherAccountId,
      email: "asd1",
      hashedPassword:
        "$2b$10$wxXsqcb7zaE0RAoay19SIOaxFIA0jDYWHTHHOTSvtTuU2KabYVwjC", //asd
      creationDate: 1657159261664,
    });
    let playerId = provider.playerInfoRepository.getId();
    await provider.playerInfoRepository.save(playerId, {
      id: playerId,
      name: "Another Test Player",
      accountId: anotherAccountId,
    });
  }

  // Load existent items
  const itemId = provider.itemsRepository.getId();
  await provider.itemsRepository.save(itemId, {
    id: "1",
    types: [ItemType.QUEST],
    icon: "ui/testItem.png",
    model: "",
    name: "Default Test Item",
    detail: "This is a Test item used only for testing purpose",
  });
  const anotherItemId = provider.itemsRepository.getId();
  await provider.itemsRepository.save(anotherItemId, {
    id: "2",
    types: [ItemType.ARMOR_EQUIPMENT, ItemType.QUEST],
    icon: "ui/testItem.png",
    model: "",
    name: "Ring of Honor",
    detail: "This is a Test item used only for testing purpose",
  });

  await provider.lootConfigurationRepository.save(
    provider.lootConfigurationRepository.getId(),
    {
      id: "simpleLoot",
      items: [
        { itemId: "1", probability: 0.2 },
        { itemId: "2", probability: 0.2 },
      ],
      minMoney: 50,
      maxMoney: 150,
      minItems: 0,
      maxItems: 2,
    }
  );

  provider.environmentObjectsRepository.save({
    id: 1,
    pivotOrigin: { x: 0.5, y: 0 },
    height: 30,
    width: 30,
    textureName: "/objects/coin-pro",
    assetType: EnvironmentObjectAssetType.spine,
    objectVariant: EnvironmentObjectVariant.decorative,
  });

  if (!provider.enemiesModelRepository.getBy({ id: SpiderEnemyModel.id }))
    await provider.enemiesModelRepository.save(
      provider.enemiesModelRepository.getId(),
      SpiderEnemyModel
    );
};
