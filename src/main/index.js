import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { StoreProvider } from '../store'
import {
    reducer as userInfoReducer,
    Provider as UserInfoProvider,
} from '../store/user_info'
import { reducer as deviceInfoReducer } from '../store/device_info'
import { reducer as userShopsReducer } from '../store/user_shops'
import { reducer as userShopInfoReducer } from '../store/user_shop_info'
import { reducer as shopProductsReducer } from '../store/shop_products'
import { reducer as shopOrdersReducer } from '../store/shop_orders'
import MeasureScreen from '../components/MeasureScreen'
import AppBar from '../components/AppBar'
import DropScreenProvider from '../components/DropScreen'
import RootPage from './RootPage'
import HomePage from './HomePage'
import ShopPage from './ShopPage'
import '../styles/text.less'

const App = props => (
    <StoreProvider
        reducers={{
            deviceInfo: deviceInfoReducer,
            userInfo: userInfoReducer,
            userShops: userShopsReducer,
            userShopInfo: userShopInfoReducer,
            shopProducts: shopProductsReducer,
            shopOrders: shopOrdersReducer,
        }}
    >
        <UserInfoProvider>
            <MeasureScreen>
                <DropScreenProvider>
                    {props.children}
                </DropScreenProvider>
            </MeasureScreen>
        </UserInfoProvider>
    </StoreProvider>
)

ReactDOM.render(
    <App>
        <HashRouter>
            <AppBar/>
            <Switch>
                <Route path='/home'>
                    <HomePage/>
                </Route>
                <Route path='/shop/:shopId'>
                    <ShopPage/>
                </Route>
                <Route path='/'>
                    <RootPage/>
                </Route>
            </Switch>
        </HashRouter>
    </App>,
    document.getElementById('root')
)