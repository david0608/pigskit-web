import React from 'react'
import clsx from 'clsx'
import DropDownList from '../../utils/DropDownList'
import './NavBarDropDownList.less'

const NavBarDropDownList = (props) => {
    const {
        className,
        rightAlign,
        ...otherProps
    } = props


    return <DropDownList className={clsx(rightAlign && 'RightAligned', 'NavBarDropDownList-Root', className)} {...otherProps}/>
}

export default NavBarDropDownList