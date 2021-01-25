const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    orders: [],
}

const actionType = {
    loading: 'SHOPORDERS_LOADING',
    refetch: 'SHOPORDERS_REFETCH',
    response: 'SHOPORDERS_RESPONSE',
    error: 'SHOPORDERS_ERROR',
    reset: 'SHOPORDERS_RESET',
}

const actions = {
    loading: () => ({
        type: actionType.loading,
    }),
    refetch: () => ({
        type: actionType.refetch,
    }),
    response: (data) => ({
        type: actionType.response,
        payload: data,
    }),
    error: () => ({
        type: actionType.error,
    }),
    reset: () => ({
        type: actionType.reset,
    })
}

function reducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.loading:
            return {
                ...state,
                loading: true,
                refetch: false,
                error: false,
            }
        case actionType.refetch:
            return {
                ...state,
                refetch: true,
            }
        case actionType.response:
            const data = action.payload
            return {
                ...state,
                inited: true,
                loading: false,
                orders: data.orders,
            }
        case actionType.error:
            return {
                ...state,
                error: false,
            }
        case actionType.reset:
            return {
                ...initState
            }
        default:
            return state
    }
}

export {
    actions,
    reducer,
}