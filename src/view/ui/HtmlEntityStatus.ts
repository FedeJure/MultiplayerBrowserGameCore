export class HtmlEntityStatus {
    element: HTMLDivElement
    constructor(width: number) {
        const container = document.createElement('div')
        this.element = document.createElement('div')
        this.element.style.color = 'whitesmoke'
        container.style.width = `fit-content`
        container.style.height = `fit-content`
        container.style.display = 'flex'
        this.element.appendChild(container)

        const name = document.createElement('p')
        name.innerText = "Entity Name"
        name.style.height = "100%"
        name.style.fontSize = "9px"
        name.style.margin = "0"
        name.style.textAlign = 'center'
        name.style.whiteSpace= 'nowrap'
        container.appendChild(name)

        const level = document.createElement('span')
        level.innerText = "4"
        level.style.fontSize = "9px"
        level.style.width = "10px"
        level.style.textAlign = 'center'


        level.style.height = "100%"

        level.style.borderRadius = "10px"
        container.appendChild(level)
    }
}