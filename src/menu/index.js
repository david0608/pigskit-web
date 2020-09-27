import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { StoreProvider, deviceInfoReducer } from '../components/store'
import MeasureScreen from '../components/MeasureScreen'
import MenuTopBar from './MenuTopBar'
import ShopInfo, { shopInfoReducer } from './ShopInfo'
import { shopProductsReducer, ShopProductsController } from './ShopProducts'
import GuestSession from './GuestSession'
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
            guestSession: GuestSession.reducer,
            ...shopInfoReducer,
            ...shopProductsReducer,
            ...cartInfoReducer,
            ...orderInfoReducer
        }}
    >
        <ShopInfo.Provider>
            <GuestSession.Provider>
                <ShopProductsController/>
                <CartInfoController/>
                <OrderInfoController/>
                <MeasureScreen>
                    {props.children}
                </MeasureScreen>
            </GuestSession.Provider>
        </ShopInfo.Provider>
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