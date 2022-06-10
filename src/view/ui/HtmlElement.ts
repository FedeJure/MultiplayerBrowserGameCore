export class HtmlElement {
    protected readonly container: HTMLDivElement
    constructor(name: string) {
        const appContainer = document.getElementsByTagName('div')[0]
        this.container = document.createElement('div')
        this.container.id = name
        this.container.style.position = 'absolute'
        this.container.setAttribute('name', name)
        appContainer.appendChild(this.container)
    }
}