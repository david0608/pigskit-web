import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { withClass } from './utils'
import Decorate from './Decorate'
import '../styles/text.less'

const styles = `
    &.Horizontal {
        height: 36px;
    }

    &.Vertical {
        >a {
            height: 36px;
        }
    }

    >a {
        text-transform: uppercase;
        display: flex;
        align-items: center;
        padding: 0px 24px;
        text-decoration: none;

        &.Actived, &:hover {
            color: white;
            background-color: #ff3333;
        }
    }
`

const ListRoot = withClass(
    clsx('Navigator-root', 'Vertical'),
    styled(Decorate.List)`${styles}`,
)

const TabListRoot = withClass(
    clsx('Navigator-root', 'Horizontal'),
    styled(Decorate.TabList)`${styles}`,
)

const Navigator = (props) => {
    const {
        className,
        links = [],
        vertical,
    } = props

    let List = vertical ? ListRoot : TabListRoot

    return (
        <List className={className}>
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