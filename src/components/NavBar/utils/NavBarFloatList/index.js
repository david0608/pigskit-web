import React from 'react'
import clsx from 'clsx'
import { FloatList, FloatItem } from '../../../utils/FloatList'
import './index.less'

export const NavBarFloatList = (props) => {
    const {
        className,
        ...otherProps
    } = props

    return <FloatList
        className={clsx('NavBarFloatList-Root', className)}
        rightAligned
        {...otherProps}
    />
}

export const NavBarFloatItem = FloatItem