import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import {
    StoreProvider,
    deviceInfoReducer,
    shopInfoReducer,
    ShopInfoProvider,
    guestSessionReducer,
    GuestSessionProvider,
    shopProductsReducer,
    ShopProductsController,
} from '../components/store'
import MeasureScreen from '../components/MeasureScreen'
import MenuTopBar from './MenuTopBar'
import Menu from './Menu'
import Cart, { cartInfoReducer, CartInfoController } from './Cart'
import Orders, { orderInfoReducer, OrderInfoController } from './Order'
import './index.less'

const MenuPage = () => (
    <div className='MenuPage-root'>
        <Switch>
            <Route path='/cart'>
                <Cart/>
            </Route>
            <Route path='/orders'>
                <Orders/>
            </Route>
            <Route path='/'>
                <Menu/>
            </Route>
        </Switch>
    </div>
)

const App = (props) => (
    <StoreProvider
        reducers={{
            deviceInfo: deviceInfoReducer,
            shopInfo: shopInfoReducer,
            guestSession: guestSessionReducer,
            ...shopProductsReducer,
            ...cartInfoReducer,
            ...orderInfoReducer
        }}
    >
        <ShopInfoProvider>
            <GuestSessionProvider>
                <ShopProductsController/>
                <CartInfoController/>
                <OrderInfoController/>
                <MeasureScreen>
                    {props.children}
                </MeasureScreen>
            </GuestSessionProvider>
        </ShopInfoProvider>
    </StoreProvider>
)

ReactDOM.render(
    <App>
        <HashRouter>
            <MenuTopBar/>
            <MenuPage/>
        </HashRouter>
    </App>,
    document.getElementById('root')
)