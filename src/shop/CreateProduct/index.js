import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Product from './Product'

const CreateProduct = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShop.data.shop.id,
        authority: state.userShop.data.productAuthority,
    })
)((props) => {
    const {
        deviceType,
        shopId,
        authority,
    } = props

    if (authority === 'ALL') {
        return <Product
            deviceType={deviceType}
            shop_id={shopId}
        />
    } else {
        return <Redirect to='/'/>
    }
})

export default CreateProduct