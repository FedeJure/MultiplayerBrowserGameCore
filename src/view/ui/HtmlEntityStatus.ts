import { HtmlLifeBar } from "./HtmlLifeBar";

export class HtmlEntityStatus {
  element: HTMLDivElement;
  private lifebar: HtmlLifeBar;
  private name: HTMLParagraphElement;
  private level: HTMLSpanElement;
  constructor(width: number) {
    this.element = document.createElement("div");
    this.element.style.padding = "1px";
    this.element.style.backgroundColor = "rgb(176 142 107 / 60%)";
    this.element.style.borderRadius = "5px";
    this.element.style.border = "1px solid rgb(176 142 107)";

    const nameLevelContainer = document.createElement("div");
    this.element.style.color = "whitesmoke";
    nameLevelContainer.style.width = `100%`;
    nameLevelContainer.style.height = `fit-content`;
    nameLevelContainer.style.display = "flex";
    this.element.appendChild(nameLevelContainer);

    this.name = document.createElement("p");
    this.name.innerText = "Entity Name";
    this.name.style.height = "10px";
    this.name.style.fontSize = "7px";
    this.name.style.margin = "0";
    this.name.style.textAlign = "center";
    this.name.style.whiteSpace = "nowrap";
    this.name.style.fontWeight = "bold";
    nameLevelContainer.appendChild(this.name);

    this.level = document.createElement("span");
    this.level.innerText = "4";
    this.level.style.fontSize = "7px";
    this.level.style.width = "10px";
    this.level.style.height = "10px";
    this.level.style.textAlign = "center";
    this.level.style.backgroundColor = "rgb(43 116 149)";
    this.level.style.border = "1px solid rgb(176 142 107)";
    this.level.style.verticalAlign = "middle";
    this.level.style.borderRadius = "10px";
    this.level.style.fontWeight = "bold";

    nameLevelContainer.appendChild(this.level);

    this.lifebar = new HtmlLifeBar(width);
    this.element.appendChild(this.lifebar.element);
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
