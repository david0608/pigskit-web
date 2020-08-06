import React from 'react'
import clsx from 'clsx'
import './index.less'

const Page = (props) => {
    const {
        className,
        children,
    } = props

    return <div className={clsx('Page', className)}>
        {children}
    </div>
}

export default Page