import React from 'react'
import clsx from 'clsx'
import './index.less'

export const T1 = (props) => {
    const {
        className,
        children,
    } = props

    return <div className={clsx('T1', className)}>{children}</div>
}

export const T2 = (props) => {
    const {
        className,
        children,
    } = props

    return <div className={clsx('T2', className)}>{children}</div>
}