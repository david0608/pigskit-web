const initState = {
    inited: false,
    id: undefined,
    name: undefined,
    latestUpdate: undefined,
}

const actionType = {
    response: 'MENUSHOPINFO_RESPONSE',
}

const actions = {
    response: data => ({
        type: actionType.response,
        payload: data,
    }),
}

function reducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.response:
            const data = action.payload
            return {
                inited: true,
                id: data.id,
                name: data.name,
                latestUpdate: data.latestUpdate,
            }
        default:
            return state
    }
}

export {
    actions,
    reducer,
}