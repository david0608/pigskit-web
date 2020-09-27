import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import QRCode from 'qrcode.react'
import App, { CheckSignedIn } from '../components/App'
import { Page, Block, SideBar, Content } from '../components/utils/Decorate/Page'
import AppBar from '../components/AppBar'
import Path from '../components/Path'
import Navigator from '../components/Navigator'
import Products, { shopProductsReducer, ShopProductsController } from './Products'
import Orders, { shopOrdersReducer, ShopOrdersController } from './Orders'
import CreateProduct from './CreateProduct'
import UserShop, { userShopReducer } from './UserShop'

const LINKS = [
    {
        name: 'outline',
        to: '/',
    },
    {
        name: 'products',
        to: '/products',
    },
    {
        name: 'orders',
        to: '/orders',
    }
]

const SwitchContent = () => (
    <Switch>
        <Route path='/products'>
            <Products/>
        </Route>
        <Route path='/orders'>
            <Orders/>
        </Route>
        <Route path='/create_product'>
            <CreateProduct/>
        </Route>
        <Route path='/'>
            <QRCode value='hello world!'/>
        </Route>
    </Switch>
)

const ShopPage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
        shopName: state.userShop.data.shop.name,
    })
)((props) => {
    const {
        deviceType,
        shopName,
    } = props

    let isDesktop = deviceType === 'desktop'

    return (
        <Page className='ShopPage'>
            <Block>
                <Path
                    path={[
                        {
                            name: shopName,
                        }
                    ]}
                />
            </Block>
            {
                isDesktop ?
                <Block deviceType={deviceType}>
                    <SideBar>
                        <Navigator vertical={isDesktop} links={LINKS}/>
                    </SideBar>
                    <Content>
                        <SwitchContent/>
                    </Content>
                </Block> :
                <>
                <Navigator vertical={isDesktop} links={LINKS}/>
                <Block deviceType={deviceType}>
                    <SwitchContent/>
                </Block>
                </>
            }
        </Page>
    )
})

ReactDOM.render(
    <App
        reducers={{
            ...userShopReducer,
            ...shopProductsReducer,
            ...shopOrdersReducer
        }}
    >
        <CheckSignedIn>
            <UserShop.Provider>
                <ShopProductsController/>
                <ShopOrdersController/>
                <HashRouter>
                    <AppBar/>
                    <ShopPage/>
                </HashRouter>
            </UserShop.Provider>
        </CheckSignedIn>
    </App>,
    document.getElementById('root')
)