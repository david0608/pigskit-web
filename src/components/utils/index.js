import React from 'react'
import clsx from 'clsx'

export function withClass(withClassName, Component) {
    return props => {
        const {
            className,
            ...otherProps
        } = props

        return (
            <Component
                className={clsx(withClassName, className)}
                {...otherProps}
            />
        )
    }
}