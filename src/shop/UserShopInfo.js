import React, { useContext, useReducer, useEffect } from 'react'
import ApolloClient, { gql } from 'apollo-boost'
import { pigskit_graphql_origin } from '../utils/service_origins'

const StateContext = React.createContext()
const DispatchContext = React.createContext()

function useState() {
    return useContext(StateContext)
}

function useDispatch() {
    return useContext(DispatchContext)
}

const initState = {
    inited: false,
    shop: {
        id: '',
        name: '',
    },
    teamAuthority: '',
    storeAuthority: '',
    productAuthority: '',
}

const actionType = {
    init: 'USERSHOPINFO_INIT',
}

const actions = {
    init: ({ shop, teamAuthority, storeAuthority, productAuthority }) => ({
        type: actionType.init,
        payload: {
            inited: true,
            shop,
            teamAuthority,
            storeAuthority,
            productAuthority,
        }
    })
}

function reducer(state, action) {
    switch (action.type) {
        case actionType.init:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

const Provider = React.memo((props) => {
    const {
        children,
    } = props

    const [state, dispatch] = useReducer(reducer, initState)
    
    return (
        <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
            {
                state.inited ?
                children :
                <InitUserShopInfo/>
            }
        </DispatchContext.Provider>
        </StateContext.Provider>
    )
})

const InitUserShopInfo = (props) => {
    const dispatch = useDispatch()
    
    useEffect(() => {
        const client = new ApolloClient({
            uri: `${pigskit_graphql_origin()}/graphql`,
            credentials: 'include',
        })

        let url = new URL(location.href)
        let search = new URLSearchParams(url.search)
        let shop_id = search.get('id')

        if (!shop_id) {
            console.error('shop_id not provided.')
            location.href = `${location.origin}/home`
            return
        }

        client.query({
            query: gql`
                query user_shop_info($id: Uuid) {
                    user {
                        me {
                            userShops(id: $id) {
                                shop {
                                    id
                                    name
                                }
                                teamAuthority
                                storeAuthority
                                productAuthority
                            }
                        }
                    }
                }
            `,
            variables: {
                id: shop_id,
            }
        })
        .then((res) => {
            let shop = res?.data?.user?.me?.userShops[0]
            if (shop) {
                dispatch(actions.init(shop))
            } else {
                throw 'shop not found'
            }
        })
        .catch((err) => {
            console.error(err)
            location.href = `${location.origin}/home`
        })
    }, [])
    
    return null
}

export default {
    Provider: Provider,
    useState: useState,
    useDispatch: useDispatch,
    actions: actions,
}