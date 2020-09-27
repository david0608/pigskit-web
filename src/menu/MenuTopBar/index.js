import React from 'react'
import { connect } from 'react-redux'
import { FiShoppingCart } from 'react-icons/fi'
import { GoListUnordered } from 'react-icons/go'
import { TopBar, TopBarButton } from '../../components/utils/Decorate/TopBar'
import '../../styles/text.less'
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