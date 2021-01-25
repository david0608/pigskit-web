const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    variables: {},
    shops: [],
}

const actionType = {
    loading: 'USERSHOPS_LOADING',
    refetch: 'USERSHOPS_REFETCH',
    response: 'USERSHOPS_RESPONSE',
    error: 'USERSHOPS_ERROR',
    reset: 'USERSHOPS_RESET',
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
                    ...action.payload
                },
                refetch: true,
            }
        case actionType.response:
            const data = action.payload
            return {
                ...state,
                inited: true,
                loading: false,
                shops: data.shops,
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