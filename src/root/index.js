import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import App from '../components/App'
import Page from '../components/Page'
import AppBar from '../components/AppBar'
import '../styles/text.less'
import './index.less'

const RootPage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
    } = props

    return (
        <Page.Root className='RootPage'>
            <div className={clsx('Welcome', 'Text_highligh', deviceType)}>
                <div className={clsx('Logo', 'Text_logo')}>Pigskit</div>
                <div className="Slogan">
                    <span>The most</span>&nbsp;
                    <span>competent assistant</span>&nbsp;
                    <span>for your shop</span>
                </div>
            </div>
        </Page.Root>
    )
})

ReactDOM.render(
    <App>
        <AppBar/>
        <RootPage/>
    </App>,
    document.getElementById('root')
)