class DropDownListElement extends HTMLElement {
    constructor() {
        super()
        this.opened = true
        this.foldCatch = false
    }

    connectedCallback() {
        this.foldCatch = this.hasAttribute('foldCatch')
        this.close()
        this.addEventListener('dropDownListToggle', (e) => this.toggle())
        this.addEventListener('dropDownListShouldFold', (e) => this.shouldFold(e))
    }

    toggle() {
        if (this.opened) {
            this.fold()
        } else {
            this.open()
        }
    }

    shouldFold(event) {
        let parentList = this.parentList()
        if (!parentList || (this.foldCatch && event.detail.catchable)) {
            this.fold()
        } else {
            parentList.dispatchEvent(new CustomEvent(
                'dropDownListShouldFold',
                { detail: { catchable: event.detail.catchable } },
            ))
        }
    }

    open() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].removeAttribute('hidden')
        }
        this.opened = true
        this.classList.add('Opened')
    }

    close() {
        for (let i = 0; i < this.children.length; i++) {
            let children = this.children[i]
            if (children.tagName !== 'DROPDOWN-LABEL') {
                children.setAttribute('hidden', 'hidden')
            }
        }
        this.opened = false
        this.classList.remove('Opened')
    }

    fold() {
        for (const list of this.querySelectorAll('dropdown-list')) {
            if (list.opened) list.close()
        }
        this.close()
    }

    parentList() {
        return this.parentElement.closest('dropdown-list')
    }
}

export default DropDownListElement

if (!window.customElements.get('dropdown-list')) {
    window.DropDownListElement = DropDownListElement
    window.customElements.define('dropdown-list', DropDownListElement)
}