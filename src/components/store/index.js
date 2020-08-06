import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

export const StoreProvider = (props) => {
    const { reducers = {} } = props;

    return (
        <Provider store={createStore(combineReducers(reducers))}>
            {props.children}
        </Provider>
    )
}

import { deviceInfoReducer } from './reducers/device_info'
import { userInfoReducer } from './reducers/user_info'

export const defaultReducers = {
    deviceInfo: deviceInfoReducer,
    userInfo: userInfoReducer,
}

export { deviceInfoActions } from './reducers/device_info'
export { userInfoActions } from './reducers/user_info'