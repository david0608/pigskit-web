import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

export const StoreProvider = (props) => {
    const { reducers = {} } = props

    return (
        <Provider store={createStore(combineReducers(reducers))}>
            {props.children}
        </Provider>
    )
}

export {
    deviceInfoReducer,
    deviceInfoActions,
    connectDeviceInfoType,
    connectDeviceInfoScrolled,
} from './reducers/device_info'

export {
    userInfoReducer,
    userInfoActions,
    UserInfoProvider,
    connectUserInfoSignedIn,
    connectUserInfoUsernameNickname,
} from './reducers/user_info'
