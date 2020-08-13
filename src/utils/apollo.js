import React, { useContext } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
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

    const { loading, error, data, refetch } = useQuery(queryStr, { variables: queryVar })
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
    const queryContext = useContext(Context)
    return queryContext
}

class QueryContext {
    constructor(props) {
        this.loading = props.loading
        this.error = props.error
        this.rawData = props.data
        this.resReducer = props.resReducer || function(r) { return r }
    }

    data() {
        return this.resReducer(this.rawData)
    }
}

const client = new ApolloClient({
    uri: `${pigskit_graphql_origin()}/graphql`,
    credentials: 'include',
})

export const QueryProvider = (props) => {
    return <ApolloProvider client={client}>
        {props.children}
    </ApolloProvider>
}