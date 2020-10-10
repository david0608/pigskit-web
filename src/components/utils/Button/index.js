import React from 'react'
import clsx from 'clsx'
import { LoadingRing } from '../Loading'
import './index.less'

const Button = (props) => {
    const {
        className,
        loading,
        children,
        ...otherProps
    } = props

    return (
        <button
            className={clsx('StyledButton', className)}
            {...otherProps}
        >
            {
                loading ?
                <LoadingRing
                    radius={8}
                    stroke='rgba(0, 0, 0, 0.2)'
                    strokeWidth={2}
                /> :
                children
            }
        </button>
    )
}

export default Button