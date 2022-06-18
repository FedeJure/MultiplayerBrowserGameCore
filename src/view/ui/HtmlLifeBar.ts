
enum LifeColors {
  full = "#00FF3A",
  middle = "#FFD500",
  low = "#FF0000",
}

export class HtmlLifeBar  {
  readonly element: HTMLDivElement;

  private lifebar: HTMLDivElement;
  constructor(width: number) {
    this.element = document.createElement("div");
    this.element.style.width = `${width}px`;
    this.element.style.height = "5px";
    this.element.style.backgroundColor = "#CBC7C7";
    this.element.style.padding = "1px";
    this.element.style.filter = "opacity(0.8)";

    this.lifebar = document.createElement("div");
    this.lifebar.style.width = `80%`;
    this.lifebar.style.height = "100%";
    this.lifebar.style.backgroundColor = LifeColors.full;

    this.element.appendChild(this.lifebar);
  }

  setPercent(_percent: number) {
    const percent = Math.min(100, Math.max(0, _percent));
    let color = LifeColors.middle;
    if (percent > 65) color = LifeColors.full;
    else if (percent < 20) color = LifeColors.low;
    this.lifebar.style.backgroundColor = color;
    this.lifebar.style.width = `${percent}%`
  }
}
