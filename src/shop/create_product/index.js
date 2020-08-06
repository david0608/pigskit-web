import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import App from '../../components/App'
import Page from '../../components/Page'
import NavBar from '../../components/NavBar'
import UserShopInfo from '../UserShopInfo'
import Avatar from '../../components/Avatar'
import Product from './Product'
import './index.less'

const NewProductPage = connect(
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
            className={clsx('NewProductPage', deviceType)}
        >
            <Avatar
                className='UserInfo'
                path={[
                    {
                        name: userShopInfoState.shop.name,
                        endPoint: `shop?id=${userShopInfoState.shop.id}`
                    }
                ]}
            />
            <Product
                deviceType={deviceType}
                shop_id={userShopInfoState.shop.id}
            />
        </Page>
    )
})

const CheckAuthority = (props) => {
    const {
        children,
    } = props

    const userShopInfoState = UserShopInfo.useState()

    if (userShopInfoState.productAuthority === 'ALL') {
        return children
    } else {
        location.href = `${location.origin}/home`
        return null
    }
}

const CheckSignedIn = connect(
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
        <NavBar/>
        <CheckSignedIn>
            <CheckAuthority>
                <NewProductPage/>
            </CheckAuthority>
        </CheckSignedIn>
    </App>,
    document.getElementById('root')
)