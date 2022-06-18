import { HtmlLifeBar } from "./HtmlLifeBar";

export class HtmlManaBar extends HtmlLifeBar {
    constructor(width: number) {
        super(width)
        this.bar.style.backgroundColor = "rgb(33,150,243,1)"
    }
}