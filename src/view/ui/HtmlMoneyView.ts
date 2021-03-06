import { GameBalance } from "../../domain/inventory/balance";
import { MoneyView } from "../../domain/inventory/moneyView";
import { AssetLoader } from "../AssetLoader";

export class HtmlMoneyView  implements MoneyView{
  private container: HTMLDivElement;
  private gold: HTMLSpanElement;
  private silver: HTMLSpanElement;
  private copper: HTMLSpanElement;
  constructor() {
    this.container = document.createElement("div");
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "end";
    this.gold = document.createElement("span");
    this.gold.style.color = "whitesmoke";
    this.gold.style.textShadow = '1px 1px 3px grey'
    this.silver = document.createElement("span");
    this.silver.style.color = "whitesmoke";
    this.silver.style.textShadow = '1px 1px 3px grey'


    this.copper = document.createElement("span");
    this.copper.style.color = "whitesmoke";
    this.copper.style.textShadow = '1px 1px 3px grey'


    const goldIcon = document.createElement("img");
    const silverIcon = document.createElement("img");
    const copperIcon = document.createElement("img");
    goldIcon.src = AssetLoader.resolveAssetPath("/ui/gold.png");
    silverIcon.src = AssetLoader.resolveAssetPath("/ui/silver.png");
    copperIcon.src = AssetLoader.resolveAssetPath("/ui/copper.png");
    goldIcon.style.height = '20px'
    silverIcon.style.height = '20px'
    copperIcon.style.height = '20px'

    this.container.append(this.gold);
    this.container.append(goldIcon);
    this.container.append(this.silver);
    this.container.append(silverIcon);
    this.container.append(this.copper);
    this.container.append(copperIcon);
    this.setBalance({ gold: 0, silver: 0, copper: 0 });
  }

  private setSize() {

  }

  get element() {
    return this.container;
  }

  setBalance(gameBalance: GameBalance) {
    this.gold.textContent = gameBalance.gold.toString();
    this.silver.textContent = gameBalance.silver.toString();
    this.copper.textContent = gameBalance.copper.toString();
  }
}
