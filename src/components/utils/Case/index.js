import React from 'react'
import clsx from 'clsx'
import { MdAttachMoney } from 'react-icons/md'
import './index.less'

function caseComponent(defaultProps) {
    const {
        className,
        ...otherDefaultProps
    } = defaultProps

    return componentProps => {
        const {
            className,
            ...otherComponentProps
        } = componentProps

        return (
            <div
                className={clsx(defaultProps.className, componentProps.className)}
                {...otherDefaultProps}
                {...otherComponentProps}
            />
        )
    }
}

const List = caseComponent({
    className: 'Case-List-root',
})

const DevideList = caseComponent({
    className: 'Case-DevideList-root',
})

const Price = (props) => {
    const {
        className,
        children,
    } = props

    return (
        <div className={clsx('Case-Price-root', className)}>
            <MdAttachMoney/>
            {children}
        </div>
    )
}

const Blank = ({ className, ...props }) => <div className={clsx('Case-Blank-root', className)} {...props}/>

export default {
    List,
    DevideList,
    Price,
    Blank,
}