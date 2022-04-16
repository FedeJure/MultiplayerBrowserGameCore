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
    pivotOrigin: { x: 0.5, y: 1 },
    height: 100,
    width: 100,
    textureName: 'coin',
    atlasPath: '/atlasPath'
  })
};
