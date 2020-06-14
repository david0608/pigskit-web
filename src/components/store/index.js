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

export * from './reducers/device_info';
export * from './reducers/user_info';