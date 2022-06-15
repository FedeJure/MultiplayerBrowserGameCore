import { Scene } from "phaser";
import { HtmlElement } from "./HtmlElement";

export class HtmlCellView extends HtmlElement {
    constructor(scene: Scene, container: HTMLDivElement) {
        super(scene, 'CellView', container)
    }
}