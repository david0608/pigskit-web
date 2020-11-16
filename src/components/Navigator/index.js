import React from 'react'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import Decorate from '../Decorate'
import '../../styles/text.less'
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
                        className='Text_content'
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