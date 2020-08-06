import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import App from '../components/App'
import Page from '../components/Page'
import NavBar from '../components/NavBar'
import Avatar from '../components/Avatar'
import Shops from './Shops'
import './index.less'

const HomePage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
        userSignedIn: state.userInfo.signedIn,
    })
)((props) => {
    const {
        deviceType,
        userSignedIn,
    } = props

    if (userSignedIn) {
        return (
            <Page className={clsx('HomePage', deviceType)}>
                <Avatar className='UserInfo'/>
                <Shops/>
            </Page>
        )
    } else {
        return null
    }
})

ReactDOM.render(
    <App>
        <NavBar/>
        <HomePage/>
    </App>,
    document.getElementById('root')
);