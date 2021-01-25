const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    products: {},
}

const actionType = {
    loading: 'MENUSHOPPRODUCTS_LOADING',
    refetch: 'MENUSHOPPRODUCTS_REFETCH',
    response: 'MENUSHOPPRODUCTS_RESPONSE',
    error: 'MENUSHOPPRODICTS_ERROR',
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
                products: data.products
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