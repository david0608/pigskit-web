import React from 'react'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import Decorate from '../utils/Decorate'
import './index.less'

const Navigator = (props) => {
    const {
        className,
        links = [],
        vertical,
    } = props

    let List = vertical ? Decorate.List : Decorate.TabList

    return (
        <List className={clsx('Navigator-root', vertical ? 'Vertical' : 'Horizontal', className)}>
            {
                links.map((e, i) => (
                    <NavLink
                        key={i}
                        to={e.to}
                        activeClassName='Actived'
                        exact
                    >
                        {e.name}
                    </NavLink>
                ))
            }
        </List>
    )
}

export default Navigator