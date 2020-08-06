import React from 'react'
import clsx from 'clsx'
import './Button.less'

const Button = (props) => {
    const {
        className,
        ...otherProps
    } = props

    return <button className={clsx('StyledButton', props.className)} {...otherProps}/>
}

export default Button