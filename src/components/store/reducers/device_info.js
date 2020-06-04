const initState = {
    // Indicate current user device type, can be 'desktop', 'tablets' or 'mobile'.
    type: 'unknown',
    // Indicate scrolled or not the screen of device have been.
    scrolled: false,
}

const actionTypes = {
    updateType: 'DEVICEINFO_UPDATE_TYPE',
    updateScrolled: 'DEVICEINFO_UPDATE_SCROLLED'
}

const deviceInfoActions = {
    updateType: (type) => ({
        type: actionTypes.updateType,
        payload: type,
    }),
    updateScrolled: (scrolled) => ({
        type: actionTypes.updateScrolled,
        payload: scrolled,
    })
}

function deviceInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case actionTypes.updateType:
            return Object.assign({}, state, { type: action.payload })
        case actionTypes.updateScrolled:
            return Object.assign({}, state, { scrolled: action.payload })
        default:
            return state
    }
}

export {
    deviceInfoReducer,
    deviceInfoActions,
}