import React from 'react'
import { connect } from 'react-redux'
import { StoreProvider, defaultReducers } from '../store'
import Measurer from '../Measurer'
import Session from '../Session'
import DropScreenProvider from '../DropScreen'
import './index.less'

const Content = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
        userInfoInited: state.userInfo.inited,
    })
)((props) => {
    const {
        deviceType,
        userInfoInited,
        children,
    } = props

    if (userInfoInited) {
        return (<>
            <Measurer/>
            {
                deviceType !== 'unknown' &&
                <DropScreenProvider>
                    {children}
                </DropScreenProvider>
            }
            <div className='test'/>
        </>)
    } else {
        return <Session/>
    }
})

const App = (props) => {
    const {
        reducers,
    } = props

    return (
        <StoreProvider
            reducers={{
                ...defaultReducers,
                ...reducers
            }}
        >
            <Content>{props.children}</Content>
        </StoreProvider>
    )
}

export default App