import { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import ApolloClient from 'apollo-boost'
import { pigskit_graphql_origin } from './service_origins'

export class Client extends ApolloClient {
    constructor() {
        super({
            uri: `${pigskit_graphql_origin()}/graphql`,
            credentials: 'include',
        })
    }
}

export function createQueryStore({
    name,
    queryStr,
    produceDefaultVariables = state => ({}),
    produceResponseData = (data) => data,
}) {
    if (!name) throw 'name must be provide in createQueryStroe.'

    const initState = {
        inited: false,
        refetch: false,
        loading: false,
        error: false,
        variables: {},
        data: {},
    }

    const actionType = {
        loadingAction: `${name}_LOADING`,
        refetchAction: `${name}_REFETCH`,
        responseAction: `${name}_RESPONSE`,
        errorAction: `${name}_ERROR`,
    }

    const actions = {
        loadingAction: () => ({
            type: actionType.loadingAction,
        }),
        refetchAction: (variables) => ({
            type: actionType.refetchAction,
            payload: variables,
        }),
        responseAction: (data) => ({
            type: actionType.responseAction,
            payload: data,
        }),
        errorAction: () => ({
            type: actionType.errorAction
        })
    }

    function reducer(state = initState, action = {}) {
        switch (action.type) {
            case actionType.loadingAction:
                return {
                    ...state,
                    loading: true,
                    refetch: false,
                    error: false,
                }
            case actionType.refetchAction:
                return {
                    ...state,
                    variables: {
                        ...state.variables,
                        ...action.payload
                    },
                    refetch: true,
                }
            case actionType.responseAction:
                return {
                    ...state,
                    inited: true,
                    loading: false,
                    data: {
                        ...action.payload
                    },
                }
            case actionType.errorAction:
                return {
                    ...state,
                    error: true,
                }
            default:
                return state
        }
    }

    const Controller = connect(
        (state) => ({
            inited: state[name].inited,
            refetch: state[name].refetch,
            loading: state[name].loading,
            variables: state[name].variables,
            ...produceDefaultVariables(state)
        }),
        (dispatch) => ({
            dispatchLoading: () => dispatch(actions.loadingAction()),
            dispatchResponse: (data) => dispatch(actions.responseAction(produceResponseData(data))),
            dispatchError: () => dispatch(actions.errorAction())
        })
    )((props) => {
        const {
            inited,
            refetch,
            loading,
            variables,
            dispatchLoading,
            dispatchResponse,
            dispatchError,
            ...defaultVariables
        } = props

        const client = useMemo(() => new Client(), [])

        useEffect(() => {
            if (loading || (inited && !refetch)) return
            
            dispatchLoading()
            
            client.query({
                query: queryStr,
                fetchPolicy: 'network-only',
                variables: { ...defaultVariables, ...variables },
            })
            .then(res => {
                dispatchResponse(res.data)
            })
            .catch(err => {
                console.log('error', err)
                dispatchError()
            })
        })
        
        return null
    })
    
    return {
        reducer: {
            [name]: reducer
        },
        actions: actions,
        Controller: Controller,
    }
}