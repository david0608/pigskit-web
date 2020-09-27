import React from 'react'
import clsx from 'clsx'
import { MdAttachMoney } from 'react-icons/md'
import decorateComponent from './decorateComponent'
import './index.less'

const List = decorateComponent({
    className: 'Decorate-List',
})

const DevideList = decorateComponent({
    className: 'Decorate-DevideList',
})

const TabList = decorateComponent({
    className: 'Decorate-TabList',
})

const Price = (props) => {
    const {
        className,
        children,
    } = props

    return (
        <div className={clsx('Decorate-Price', className)}>
            <MdAttachMoney/>
            <span>
                {children}
            </span>
        </div>
    )
}

const Blank = decorateComponent({
    className: 'Decorate-Blank',
})

export default {
    List,
    DevideList,
    TabList,
    Price,
    Blank,
}