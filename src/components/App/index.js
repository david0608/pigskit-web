import React from 'react'
import { connect } from 'react-redux'
import {
    StoreProvider,
    deviceInfoReducer,
    userInfoReducer,
    UserInfoProvider,
} from '../store'
import MeasureScreen from '../MeasureScreen'
import DropScreenProvider from '../DropScreen'

const App = (props) => {
    const {
        reducers,
        children,
    } = props

    return (
        <StoreProvider
            reducers={{
                deviceInfo: deviceInfoReducer,
                userInfo: userInfoReducer,
                ...reducers
            }}
        >
            <UserInfoProvider>
                <MeasureScreen>
                    <DropScreenProvider>
                        {children}
                    </DropScreenProvider>
                </MeasureScreen>
            </UserInfoProvider>
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