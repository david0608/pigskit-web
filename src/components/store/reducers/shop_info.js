import { useEffect } from 'react'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { Client } from '../../../utils/apollo'

const initState = {
    inited: false,
    id: '',
    name: '',
    latestUpdate: '',
}

const actionType = {
    init: 'SHOPINFO_INIT',
    refetch: 'SHOPINFO_REFETCH',
}

const shopInfoActions = {
    init: ({
        id,
        name,
        latestUpdate,
    }) => ({
        type: actionType.init,
        payload: {
            inited: true,
            id,
            name,
            latestUpdate,
        }
    }),
    refetch: () => ({
        type: actionType.refetch,
    })
}

function shopInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.init:
            return {
                ...state,
                ...action.payload,
            }
        case actionType.refetch:
            return {
                ...initState
            }
        default:
            return state
    }
}

const ShopInfoProvider = connect(
    (state) => ({
        shopInfoInited: state.shopInfo.inited,
    }),
    (dispatch) => ({
        initShopInfo: (info = {}) => dispatch(shopInfoActions.init(info))
    }),
)((props) => {
    const {
        shopInfoInited,
        initShopInfo,
        children,
    } = props

    useEffect(() => {
        if (shopInfoInited) return

        const client = new Client

        let url = new URL(location.href)
        let search = new URLSearchParams(url.search)
        let shop_id = search.get('id')

        client.query({
            query: gql`
                query shop_info($id: Uuid!) {
                    shop {
                        search(id: $id) {
                            id
                            name
                            latestUpdate
                        }
                    }
                }
            `,
            variables: {
                id: shop_id,
            }
        })
        .then((res) => {
            let info = res?.data?.shop?.search?.[0]
            if (info) {
                initShopInfo(info)
            } else {
                throw 'shop not found'
            }
        })
        .catch((err) => {
            console.error(err)
        })
    }, [shopInfoInited])

    if (shopInfoInited) {
        return (children)
    } else {
        return null
    }
})

export {
    shopInfoReducer,
    shopInfoActions,
    ShopInfoProvider,
}