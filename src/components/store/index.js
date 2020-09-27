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

export { deviceInfoReducer, deviceInfoActions } from './reducers/device_info'
export { userInfoReducer, userInfoActions, UserInfoProvider } from './reducers/user_info'
