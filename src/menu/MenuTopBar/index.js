import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { FiShoppingCart } from 'react-icons/fi'
import { GoListUnordered } from 'react-icons/go'
import { TopBar, TopBarButton } from '../../components/utils/Decorate/TopBar'
import './index.less'

const MenuTopBar = () => {

    return (
        <TopBar className='MenuTopBar'>
            <NavButton to='/orders'><GoListUnordered/></NavButton>
            <Logo/>
            <NavButton className='CartButton' to='/cart'><FiShoppingCart/></NavButton>
        </TopBar>
    )
}

const Logo = connect(
    (state) => ({
        shopName: state.shopInfo.name,
        shopId: state.shopInfo.id,
    })
)((props) => {
    const {
        shopName,
        shopId,
    } = props

    return (
        <div
            className={clsx('Logo')}
            onClick={() => location.href = `${location.origin}${location.pathname}?id=${shopId}#/`}
        >
            <span>{shopName}</span>
        </div>
    )
})

const NavButton = connect(
    (state) => ({
        shopId: state.shopInfo.id,
    })
)((props) => {
    const {
        shopId,
        className,
        to,
        children,
    } = props

    return (
        <TopBarButton
            className={className}
            deviceType='mobile'
            onClick={() => location.href = `${location.origin}${location.pathname}?id=${shopId}#${to}`}
        >
            {children}
        </TopBarButton>
    )
})

export default MenuTopBar