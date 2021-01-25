const initState = {
    inited: false,
}

const actionType = {
    init: 'GUESTSESSION_INIT',
}

const actions = {
    init: () => ({
        type: actionType.init,
    }),
}

function reducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.init:
            return {
                inited: true,
            }
        default:
            return state
    }
}

export {
    actions,
    reducer,
}