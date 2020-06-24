class DropDownLabelElement extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        if (!this.parentList()) {
            console.error('No parent dropdown-list element found.')
            return
        }
        this.addEventListener('click', (e) => this.click(e))
    }

    click(event) {
        this.parentList().dispatchEvent(
            new CustomEvent(
                'dropDownListToggle',
            )
        )
    }

    parentList() {
        return this.closest('dropdown-list')
    }
}

export default DropDownLabelElement;

if (!window.customElements.get('dropdown-label')) {
    window.DropDownLabelElement = DropDownLabelElement
    window.customElements.define('dropdown-label', DropDownLabelElement)
}