class DropDownItemElement extends HTMLElement {
    constructor() {
        super()
        this.foldCatchable = true
        this.manualFold = false
    }

    connectedCallback() {
        if (!this.parentList()) {
            console.error('No parent dropdown-list element found.')
            return
        }
        this.foldCatchable = !this.hasAttribute('foldUncatchable')
        this.manualFold = this.hasAttributes('manualFold')
        if (!this.manualFold) {
            this.addEventListener('click', (e) => this.startFold())
        }
    }

    startFold() {
        this.parentList().dispatchEvent(
            new CustomEvent(
                'dropDownListShouldFold',
                {
                    detail: {
                        catchable: this.foldCatchable,
                    },
                },
            )
        )
    }

    parentList() {
        return this.closest('dropdown-list')
    }
}

export default DropDownItemElement

if (!window.customElements.get('dropdown-item')) {
    window.DropDownItemElement = DropDownItemElement
    window.customElements.define('dropdown-item', DropDownItemElement)
}