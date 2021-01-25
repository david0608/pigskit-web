const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    variables: {},
    products: [],
}

const actionType = {
    loading: 'SHOPPRODUCTS_LOADING',
    refetch: 'SHOPPRODUCTS_REFETCH',
    response: 'SHOPPRODUCTS_RESPONSE',
    error: 'SHOPPRODUCTS_ERROR',
    reset: 'SHOPPRODUCTS_RESET',
}

const actions = {
    loading: () => ({
        type: actionType.loading,
    }),
    refetch: (variables) => ({
        type: actionType.refetch,
        payload: variables,
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
                variables: {
                    ...state.variables,
                    ...action.payload,
                },
                refetch: true,
            }
        case actionType.response:
            const data = action.payload
            return {
                ...state,
                inited: true,
                loading: false,
                products: data.products,
            }
        case actionType.error:
            return {
                ...state,
                error: true,
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