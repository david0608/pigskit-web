import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FiShoppingCart } from 'react-icons/fi'
import { GoListUnordered } from 'react-icons/go'
import TopBar from '../components/TopBar'
import '../styles/text.less'

const TopBarRoot = styled(TopBar.Root)`
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

const MenuTopBar = () => (
    <TopBarRoot>
        <NavButton to='/orders'><GoListUnordered/></NavButton>
        <Logo/>
        <NavButton className='CartButton' to='/cart'><FiShoppingCart/></NavButton>
    </TopBarRoot>
)

const Logo = connect(
    (state) => ({
        shopName: state.shopInfo.data.name,
        shopId: state.shopInfo.data.id,
    })
)((props) => {
    const {
        shopName,
        shopId,
    } = props

    return (
        <div
            className='Logo'
            onClick={() => location.href = `${location.origin}${location.pathname}?id=${shopId}#/`}
        >
            <span className='Text_logo_2nd'>{shopName}</span>
        </div>
    )
})

const NavButton = connect(
    (state) => ({
        shopId: state.shopInfo.data.id,
    })
)((props) => {
    const {
        shopId,
        className,
        to,
        children,
    } = props

    return (
        <TopBar.Button
            className={className}
            deviceType='mobile'
            onClick={() => location.href = `${location.origin}${location.pathname}?id=${shopId}#${to}`}
        >
            {children}
        </TopBar.Button>
    )
})

export default MenuTopBar