import decorateComponent from '../decorateComponent'
import './index.less'

export const Page = decorateComponent({
    className: 'Decorate-Page'
})

export const Block = decorateComponent({
    className: 'Decorate-Page-block'
})

export const SideBar = decorateComponent({
    className: 'Decorate-Page-sidebar'
})

export const Content = decorateComponent({
    className: 'Decorate-Page-content'
})