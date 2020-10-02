import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import App from '../components/App'
import { Page } from '../components/utils/Decorate/Page'
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
        <Page className='RootPage'>
            <div className={clsx('Slogan', 'Text_highlight', deviceType)}>
                <div>
                    <div>The most</div>
                    <div>competent assistant</div>
                    <div>for your shop</div>
                </div>
            </div>
        </Page>
    )
})

ReactDOM.render(
    <App>
        <AppBar/>
        <RootPage/>
    </App>,
    document.getElementById('root')
)