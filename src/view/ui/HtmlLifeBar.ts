
enum LifeColors {
  full = "#00FF3A",
  middle = "#FFD500",
  low = "#FF0000",
}

export class HtmlLifeBar  {
  readonly element: HTMLDivElement;

  protected bar: HTMLDivElement;
  constructor(width: number, height: number = 2) {
    this.element = document.createElement("div");
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.backgroundColor = "#CBC7C7";
    this.element.style.padding = "1px";
    this.element.style.filter = "opacity(0.8)";
    this.element.style.borderRadius = '5px'

    this.bar = document.createElement("div");
    this.bar.style.width = `80%`;
    this.bar.style.height = "100%";
    this.bar.style.backgroundColor = LifeColors.full;
    this.bar.style.borderRadius = '5px'

    this.element.appendChild(this.bar);
  }

  setPercent(_percent: number) {
    const percent = Math.min(100, Math.max(0, _percent));
    let color = LifeColors.middle;
    if (percent > 65) color = LifeColors.full;
    else if (percent < 20) color = LifeColors.low;
    this.bar.style.backgroundColor = color;
    this.bar.style.width = `${percent}%`
  }
}
