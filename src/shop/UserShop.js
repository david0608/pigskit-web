import React from 'react'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../utils/apollo'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'userShop',
    queryStr: gql`
        query user_shop($id: Uuid!) {
            user {
                me {
                    shops(id: $id) {
                        shop {
                            id
                            name
                        }
                        memberAuthority
                        orderAuthority
                        productAuthority
                    }
                }
            }
        }
    `,
    produceDefaultVariables: state => {
        let url = new URL(location.href)
        let search = new URLSearchParams(url.search)
        let shopId = search.get('id')
        return {
            id: shopId,
        }
    },
    produceResponseData: data => ({
        ...data.user.me.shops[0]
    })
})

export {
    reducer as userShopReducer,
    actions as userShopActions,
    Controller as UserShopController,
}

const Check = connect(
    state => ({
        inited: state.userShop.inited,
        loading: state.userShop.loading,
        error: state.userShop.error,
        data: state.userShop.data,
    })
)(props => {
    const {
        inited,
        loading,
        error,
        data,
        children,
    } = props
    
    if (!inited || loading || error || !data.shop) {
        return null
    } else {
        return children
    }
})

const Provider = props => {
    const {
        children,
    } = props

    return (
        <>
            <Controller/>
            <Check>
                {children}
            </Check>
        </>
    )
}

export default {
    Provider,
}