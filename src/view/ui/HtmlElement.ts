import { GameObjects, Scene } from "phaser";

export class HtmlElement extends GameObjects.GameObject {
  protected readonly container: HTMLDivElement;
  constructor(scene: Scene, name: string, container: HTMLDivElement) {
    super(scene, name);
    this.container = document.createElement("div");
    this.container.id = name;
    this.container.style.position = "absolute";
    this.container.setAttribute("name", name);
    container.appendChild(this.container);
    this.container.hidden = true;
    container.requestFullscreen();
  }

  setVisible(visible: boolean) {
    this.container.hidden = visible;
  }

  get visible() {
    return !this.container.hidden;
  }
}
