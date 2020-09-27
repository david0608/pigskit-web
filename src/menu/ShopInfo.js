import React from 'react'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../utils/apollo'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'shopInfo',
    queryStr: gql`
        query shop_info($shopId: Uuid!) {
            shop {
                search(id: $shopId) {
                    id
                    name
                    latestUpdate
                }
            }
        }
    `,
    produceDefaultVariables: state => {
        let url = new URL(location.href)
        let search = new URLSearchParams(url.search)
        let shopId = search.get('id')
        return {
            shopId: shopId,
        }
    },
    produceResponseData: data => ({
        ...data.shop.search[0]
    }),
})

export {
    reducer as shopInfoReducer,
    actions as shopInfoActions,
    Controller as ShopInfoController,
}

const Check = connect(
    state => ({
        inited: state.shopInfo.inited,
        loading: state.shopInfo.loading,
        error: state.shopInfo.error,
        data: state.shopInfo.data,
    })
)(props => {
    const {
        inited,
        loading,
        error,
        data,
        children,
    } = props

    if (!inited || loading || error || !data.id) {
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