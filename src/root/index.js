import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import App from '../components/App'
import { Page } from '../components/utils/Decorate/Page'
import AppBar from '../components/AppBar'

const RootPage = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
    } = props

    return (
        <Page className='RootPage'></Page>
    )
})

ReactDOM.render(
    <App>
        <AppBar/>
        <RootPage/>
    </App>,
    document.getElementById('root')
)