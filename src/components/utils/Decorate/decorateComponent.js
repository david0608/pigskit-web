import React from 'react'
import clsx from 'clsx'

export default function decorateComponent(defaultProps) {
    const {
        className,
        deviceType,
        ...otherDefaultProps
    } = defaultProps

    return componentProps => {
        const {
            className,
            deviceType = defaultProps.deviceType,
            ...otherComponentProps
        } = componentProps

        return (
            <div
                className={clsx(defaultProps.className, className, deviceType)}
                {...otherDefaultProps}
                {...otherComponentProps}
            />
        )
    }
}