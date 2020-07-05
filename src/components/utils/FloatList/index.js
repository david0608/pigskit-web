import React from 'react'
import { FoldList, FoldItem } from '../FoldList'
import './index.less'
import clsx from 'clsx'

export const FloatList = (props) => {
    const {
        className,
        rightAligned,
        fullScreen,
        ...otherProps
    } = props

    let theme = ''
    if (fullScreen) {
        theme = 'FullScreen'
    } else if (rightAligned) {
        theme = 'RightAligned'
    } else {
        theme = 'LeftAligned'
    }

    return <FoldList
        className={clsx('FloatList-Root', theme, className)}
        preventScroll={fullScreen}
        {...otherProps}
    />
}

export const FloatItem = React.forwardRef((props, ref) => {
    const {
        className,
        ...otherProps
    } = props

    return <FoldItem
        ref={ref}
        className={clsx('FloatItem-Root', className)}
        {...otherProps}
    />
})