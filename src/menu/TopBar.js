import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FiShoppingCart } from 'react-icons/fi'
import { GoListUnordered } from 'react-icons/go'
import TopBarComponent from '../components/TopBar'

const TopBarRoot = styled(TopBarComponent.Root)`
    height: 48px;

    &.TopBar-body>.TopBar-content {
        max-width: 498px;

        >.Logo {
            margin-left: auto;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        >.CartButton {
            margin-left: auto;
        }
    }
`

const TopBar = () => (
    <TopBarRoot>
        <NavButton to='/orders'><GoListUnordered/></NavButton>
        <Logo/>
        <NavButton className='CartButton' to='/cart'><FiShoppingCart/></NavButton>
    </TopBarRoot>
)

const Logo = connect(
    state => ({
        shopName: state.menuShopInfo.name,
    })
)(props => {
    const {
        shopName,
    } = props

    return (
        <div
            className='Logo'
            onClick={() => location.href = `${location.origin}${location.pathname}${location.search}#/`}
        >
            <span className='Text_logo_2nd'>{shopName}</span>
        </div>
    )
})

const NavButton = props => {
    const {
        className,
        to,
        children,
    } = props

    return (
        <TopBarComponent.Button
            className={className}
            deviceType='mobile'
            onClick={() => location.href = `${location.origin}${location.pathname}${location.search}#${to}`}
        >
            {children}
        </TopBarComponent.Button>
    )
}

export default TopBar