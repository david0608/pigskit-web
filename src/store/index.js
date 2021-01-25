import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

const StoreProvider = props => {
    const {
        reducers = {},
        children,
    } = props

    return (
        <Provider
            store={createStore(combineReducers(reducers))}
        >
            {children}
        </Provider>
    )
}

export {
    StoreProvider,
}