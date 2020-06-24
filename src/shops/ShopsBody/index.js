import React from 'react'
import clsx from 'clsx'
import ShopsCtrlBar from './ShopsCtrlBar'

const ShopsBody = (props) => {
    const {
        className,
    } = props

    return (
        <div className={clsx('ShopsBody-Root', className)}>
            <ShopsCtrlBar/>
        </div>
    )
}

export default ShopsBody