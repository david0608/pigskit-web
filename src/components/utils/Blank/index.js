import React from 'react'
import clsx from 'clsx'
import './index.less'

const Blank = (props) => {
    const {
        className,
        children,
    } = props

    return <div className={clsx('Blank', className)}>{children}</div>
}

export default Blank