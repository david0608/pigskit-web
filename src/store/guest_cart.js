const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    items: [],
}

const actionType = {
    loading: 'GUESTCART_LOADING',
    refetch: 'GUESTCART_REFETCH',
    response: 'GUESTCART_RESPONSE',
    error: 'GUESTCART_ERROR',
}

const actions = {
    loading: () => ({
        type: actionType.loading,
    }),
    refetch: () => ({
        type: actionType.refetch,
    }),
    response: data => ({
        type: actionType.response,
        payload: data,
    }),
    error: () => ({
        type: actionType.error,
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
                items: data.items,
            }
        case actionType.error:
            return {
                ...state,
                error: true,
            }
        default:
            return state
    }
}

export {
    actions,
    reducer,
}