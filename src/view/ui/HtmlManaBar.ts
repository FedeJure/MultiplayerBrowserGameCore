import { HtmlLifeBar } from "./HtmlLifeBar";

export class HtmlManaBar extends HtmlLifeBar {
    constructor(width: number, height: number = 2) {
        super(width, height)
        this.bar.style.backgroundColor = "rgb(33,150,243,1)"
    }
}