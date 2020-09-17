import React, { useContext, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import ApolloClient from 'apollo-boost'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import { pigskit_graphql_origin } from './service_origins'

const Context = React.createContext()

export function queryComponent(props) {
    return React.forwardRef((componentProps, ref) => {
        return <Query
            ref={ref}
            {...props}
            {...componentProps}
        />
    })
}

export const Query = React.memo(React.forwardRef((props, ref) => {
    const {
        queryStr,
        queryVar = {},
        paramDispatcher,
        resReducer,
        children,
    } = props

    const { loading, error, data, refetch } = useQuery(queryStr, { variables: queryVar, fetchPolicy: 'network-only' })
    const context = new QueryContext({
        loading: loading,
        error: error,
        data: data,
        resReducer: resReducer,
    })

    return (
        <Context.Provider value={context}>
            <RefetchQuery
                forwardRef={ref}
                refetch={refetch}
                paramDispatcher={paramDispatcher}
                queryVar={queryVar}
            />
            {children}
        </Context.Provider>
    )
}))

class RefetchQuery extends React.Component {
    constructor(props) {
        super(props)
        this.forwardRef = props.forwardRef
    }

    componentDidMount() {
        if (this.forwardRef) {
            this.forwardRef.current = this
        }
    }

    refetch(params = {}) {
        const paramDispatcher = this.props.paramDispatcher || function(p) { return p }
        this.props.refetch(Object.assign({}, this.props.queryVar, paramDispatcher(params)))
    }

    render() {
        return null
    }
}

export function useQueryContext() {
    return useContext(Context)
}

class QueryContext {
    constructor(props) {
        this.loading = props.loading
        this.error = props.error
        this.rawData = props.data
        this.resReducer = props.resReducer || function(r) { return r }
    }

    get data() {
        return this.resReducer(this.rawData)
    }
}

export class Client extends ApolloClient {
    constructor() {
        super({
            uri: `${pigskit_graphql_origin()}/graphql`,
            credentials: 'include',
        })
    }
}

export const QueryProvider = (props) => {
    return <ApolloProvider client={new Client}>
        {props.children}
    </ApolloProvider>
}

export function createQueryStore({
    name,
    queryStr,
    produceQueryVariables = (state) => ({}),
    produceResponseData = (data) => data,
}) {
    if (!name) throw 'name must be provide in createQueryStroe.'

    const initState = {
        inited: false,
        refetch: false,
        loading: false,
        error: false,
        data: null,
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
        refetchAction: () => ({
            type: actionType.refetchAction,
        }),
        responseAction: (data) => ({
            type: actionType.responseAction,
            payload: data
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
                    refetch: true,
                }
            case actionType.responseAction:
                return {
                    ...state,
                    inited: true,
                    loading: false,
                    refetch: false,
                    data: {
                        ...state.data,
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
            ...produceQueryVariables(state)
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
            dispatchLoading,
            dispatchResponse,
            dispatchError,
            ...queryVariables
        } = props

        const client = useMemo(() => new Client(), [])

        useEffect(() => {
            if (loading || (inited && !refetch)) return
            
            dispatchLoading()
            
            client.query({
                query: queryStr,
                fetchPolicy: 'network-only',
                variables: { ...queryVariables },
            })
            .then((res) => {
                dispatchResponse(res.data)
            })
            .catch((err) => {
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