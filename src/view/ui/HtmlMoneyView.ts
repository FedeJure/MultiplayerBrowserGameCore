import { Money } from "../../domain/inventory/Money";
import { AssetLoader } from "../AssetLoader";

export class HtmlMoneyView {
  private container: HTMLDivElement;
  private gold: HTMLSpanElement;
  private silver: HTMLSpanElement;
  private copper: HTMLSpanElement;
  constructor() {
    this.container = document.createElement("div");
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.gold = document.createElement("span");
    this.gold.style.color = "whitesmoke";
    this.silver = document.createElement("span");
    this.silver.style.color = "whitesmoke";

    this.copper = document.createElement("span");
    this.copper.style.color = "whitesmoke";

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
    this.setMoney({ gold: 0, silver: 0, copper: 0 });
  }

  get element() {
    return this.container;
  }

  setMoney(money: Money) {
    this.gold.textContent = money.gold.toString();
    this.silver.textContent = money.silver.toString();
    this.copper.textContent = money.copper.toString();
  }
}
