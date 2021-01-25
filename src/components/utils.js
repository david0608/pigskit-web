import React from 'react'
import clsx from 'clsx'

export function withClass(withClassName, Component) {
    return React.forwardRef((props, ref) => {
        const {
            className,
            ...otherProps
        } = props

        return (
            <Component
                ref={ref}
                className={clsx(withClassName, className)}
                {...otherProps}
            />
        )
    })
}