const initState = {
    inited: false,
    refetch: false,
    loading: false,
    error: false,
    variables: {},
    id: undefined,
    name: undefined,
    memberAuthority: undefined,
    orderAuthority: undefined,
    productAuthority: undefined,
}

const actionType = {
    loading: 'USERSHOPINFO_LOADING',
    refetch: 'USERSHOPINFO_REFETCH',
    response: 'USERSHOPINFO_RESPONSE',
    error: 'USERSHOPINFO_ERROR',
    reset: 'USERSHOPINFO_RESET',
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
                id: data.id,
                name: data.name,
                memberAuthority: data.memberAuthority,
                orderAuthority: data.orderAuthority,
                productAuthority: data.productAuthority,
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