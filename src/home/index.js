import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App, { CheckSignedIn } from '../components/App'
import { Page, Block, SideBar, Content } from '../components/utils/Decorate/Page'
import AppBar from '../components/AppBar'
import Navigator from '../components/Navigator'
import Avatar from '../components/Avatar'
import Path from '../components/Path'
import Shops, { myShopsReducer, MyShopsController } from './Shops'
import Profile from './Profile'
import './index.less'

const LINKS = [
    {
        name: 'shops',
        to: '/',
    },
    {
        name: 'profile',
        to: '/profile',
    },
]

const SwitchContent = () => (
    <Switch>
        <Route path='/profile'>
            <Profile/>
        </Route>
        <Route path='/'>
            <Shops/>
        </Route>
    </Switch>
)

const HomePage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
    } = props

    let isDesktop = deviceType === 'desktop'

    return (
        <Page className='HomePage'>
            <Block className='Header'>
                <Avatar/>
                <Path/>
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
            ...myShopsReducer
        }}
    >
        <CheckSignedIn>
            <MyShopsController/>
            <HashRouter>
                <AppBar/>
                <HomePage/>
            </HashRouter>
        </CheckSignedIn>
    </App>,
    document.getElementById('root')
)