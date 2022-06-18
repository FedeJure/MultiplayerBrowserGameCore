import { StatusUi } from "./HtmlEntityStatus";
import { HtmlLifeBar } from "./HtmlLifeBar";
import { HtmlManaBar } from "./HtmlManaBar";

export class HtmlLocalPlayerStatus implements StatusUi {
  element: HTMLDivElement;
  private lifebar: HtmlLifeBar;
  private name: HTMLParagraphElement;
  private level: HTMLSpanElement;
  constructor() {
    const width = 350;
    this.element = document.createElement("div");
    this.element.style.padding = "1px";
    this.element.style.backgroundColor = "rgb(176 142 107 / 60%)";
    this.element.style.borderRadius = "5px";
    this.element.style.border = "1px solid rgb(176 142 107)";
    this.element.style.margin = "1em"

    const nameLevelContainer = document.createElement("div");
    this.element.style.color = "whitesmoke";
    nameLevelContainer.style.width = `100%`;
    nameLevelContainer.style.height = `fit-content`;
    nameLevelContainer.style.display = "flex";
    nameLevelContainer.style.alignItems = 'center'

    this.element.appendChild(nameLevelContainer);

    this.name = document.createElement("p");
    this.name.innerText = "Entity Name";
    this.name.style.height = "20px";
    this.name.style.fontSize = "20px";
    this.name.style.margin = "0";
    this.name.style.textAlign = "left";
    this.name.style.paddingBottom = "4%";
    this.name.style.whiteSpace = "nowrap";
    this.name.style.fontWeight = "bold";
    this.name.style.flexGrow = "2";
    nameLevelContainer.appendChild(this.name);

    this.level = document.createElement("span");
    this.level.innerText = "4";
    this.level.style.fontSize = "20px";
    this.level.style.width = "25px";
    this.level.style.height = "25px";
    this.level.style.textAlign = "center";
    this.level.style.backgroundColor = "rgb(43 116 149)";
    this.level.style.border = "0.5px solid rgb(176 142 107)";
    this.level.style.verticalAlign = "middle";
    this.level.style.borderRadius = "20px";
    this.level.style.fontWeight = "bold";

    nameLevelContainer.appendChild(this.level);

    this.lifebar = new HtmlLifeBar(width, 10);
    this.element.appendChild(this.lifebar.element);
    this.element.appendChild(new HtmlManaBar(width, 10).element);
  }

  setName(name: string) {
    this.name.innerText = name;
  }

  setLifePercent(percent: number) {
    this.lifebar.setPercent(percent);
  }

  setLevel(level: number) {
    this.level.innerText = level.toString();
  }
}
