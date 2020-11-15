import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App, { CheckSignedIn } from '../components/App'
import Page from '../components/Page'
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
        <Page.Root className='HomePage'>
            <Page.Block className='Header'>
                <Avatar/>
                <Path/>
            </Page.Block>
            {
                isDesktop ?
                <Page.Block deviceType={deviceType}>
                    <Page.SideBar>
                        <Navigator vertical={isDesktop} links={LINKS}/>
                    </Page.SideBar>
                    <Page.Content>
                        <SwitchContent/>
                    </Page.Content>
                </Page.Block> :
                <>
                <Navigator vertical={isDesktop} links={LINKS}/>
                <Page.Block deviceType={deviceType}>
                    <SwitchContent/>
                </Page.Block>
                </>
            }
        </Page.Root>
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