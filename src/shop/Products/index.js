import React from 'react'
import { gql } from 'apollo-boost'
import { queryComponent } from '../../utils/apollo'
import Terminal from '../../components/Terminal'
import UserShopInfo from '../UserShopInfo'

const Products = (props) => {
    const userShopInfoState = UserShopInfo.useState()

    const newUrl = userShopInfoState.productAuthority === 'ALL' ?
        `${location.origin}/shop/create_product?id=${userShopInfoState.shop.id}` : null

    return (
        <Terminal
            className='Products'
            label='Products'
            newUrl={newUrl}
        />
    )
}

export default Products