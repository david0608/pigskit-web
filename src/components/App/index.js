import React from 'react'
import { connect } from 'react-redux'
import { StoreProvider, defaultReducers } from '../store'
import MeasureScreen from '../MeasureScreen'
import { UserInfo } from '../Session'
import DropScreenProvider from '../DropScreen'
import './index.less'

const App = (props) => {
    const {
        reducers,
        children,
    } = props

    return (
        <StoreProvider
            reducers={{
                ...defaultReducers,
                ...reducers
            }}
        >
            <UserInfo>
                <MeasureScreen>
                    <DropScreenProvider>
                        {children}
                    </DropScreenProvider>
                    <div className='test'></div>
                </MeasureScreen>
            </UserInfo>
        </StoreProvider>
    )
}

export const CheckSignedIn = connect(
    (state) => ({
        userSignedIn: state.userInfo.signedIn,
    })
)((props) => {
    const {
        userSignedIn,
        children,
    } = props

    if (userSignedIn) {
        return children
    } else {
        location.href = `${location.origin}/`
        return null
    }
})

export default App