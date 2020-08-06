import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import App from '../components/App'
import Page from '../components/Page'
import NavBar from '../components/NavBar'
import UserShopInfo from './UserShopInfo'
import Avatar from '../components/Avatar'
import Products from './Products'
import './index.less'

const ShopPage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
    } = props

    const userShopInfoState = UserShopInfo.useState()

    return (
        <Page
            className={clsx('ShopPage', deviceType)}
        >
            <Avatar
                className='UserInfo'
                path={[
                    {
                        name: userShopInfoState.shop.name
                    }
                ]}
            />
            <Products/>
        </Page>
    )
})

const CheckAndProvider = connect(
    (state) => ({
        userSignedIn: state.userInfo.signedIn,
    })
)((props) => {
    const {
        userSignedIn,
        children,
    } = props

    if (userSignedIn) {
        return (
            <UserShopInfo.Provider>
                {children}
            </UserShopInfo.Provider>
        )
    } else {
        location.href = `${location.origin}/home`
        return null
    }
})

ReactDOM.render(
    <App>
        <CheckAndProvider>
            <NavBar/>
            <ShopPage/>
        </CheckAndProvider>
    </App>,
    document.getElementById('root')
)