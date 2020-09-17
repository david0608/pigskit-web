import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import QRCode from 'qrcode.react'
import App, { CheckSignedIn } from '../components/App'
import { Page, Block, SideBar, Content } from '../components/utils/Decorate/Page'
import AppBar from '../components/AppBar'
import Path from '../components/Path'
import UserShopInfo from './UserShopInfo'
import Products from './Products'
import CreateProduct from './CreateProduct'
import Navigator from '../components/Navigator'

const LINKS = [
    {
        name: 'outline',
        to: '/',
    },
    {
        name: 'products',
        to: '/products',
    }
]

const SwitchContent = () => (
    <Switch>
        <Route path='/products'>
            <Products/>
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
    })
)((props) => {
    const {
        deviceType,
    } = props

    const userShopInfoState = UserShopInfo.useState()

    let isDesktop = deviceType === 'desktop'

    return (
        <Page className='ShopPage'>
            <Block>
                <Path
                    path={[
                        {
                            name: userShopInfoState.shop.name,
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
    <App>
        <CheckSignedIn>
            <UserShopInfo.Provider>
                <HashRouter>
                    <AppBar/>
                    <ShopPage/>
                </HashRouter>
            </UserShopInfo.Provider>
        </CheckSignedIn>
    </App>,
    document.getElementById('root')
)