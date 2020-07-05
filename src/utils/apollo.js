import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'

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

export const Query = React.forwardRef((props, ref) => {
    const {
        queryStr,
        queryVar = {},
        queryDispatcher,
        queryReducer,
        children,
    } = props

    const { loading, error, data, refetch } = useQuery(queryStr, { variables: queryVar })
    const context = new QueryContext({
        loading: loading,
        error: error,
        data: data,
        queryReducer: queryReducer,
    })

    return (
        <Context.Provider value={context}>
            <RefetchQuery
                forwardRef={ref}
                refetch={refetch}
                dispatcher={queryDispatcher}
                queryVar={queryVar}
            />
            {children}
        </Context.Provider>
    )
})

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

    refetch(variables = {}) {
        const dispatcher = this.props.dispatcher || function(v) { return v }
        this.props.refetch(Object.assign({}, this.props.queryVar, dispatcher(variables)))
    }

    render() {
        return null
    }
}

export function useQeuryContext() {
    const queryContext = useContext(Context)
    return queryContext
}

class QueryContext {
    constructor(props) {
        this.loading = props.loading
        this.error = props.error
        this.rawData = props.data
        this.queryReducer = props.queryReducer || function(p) { return p }
    }

    data() {
        return this.queryReducer(this.rawData)
    }
}