import { gql } from 'apollo-boost'
import { createQueryStore } from '../../../utils/apollo'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'shopProducts',
    queryStr: gql`
        query shop_products($shopId: Uuid!) {
            shop {
                search(id: $shopId) {
                    productsJson
                }
            }
        }
    `,
    produceQueryVariables: (state) => ({
        shopId: state.shopInfo.id,
    }),
    produceResponseData: (data) => ({
        products: { ...JSON.parse(data.shop.search[0].productsJson) }
    })
})

export {
    reducer as shopProductsReducer,
    actions as shopProductsActions,
    Controller as ShopProductsController,
}