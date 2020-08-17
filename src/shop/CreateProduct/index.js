import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import UserShopInfo from '../UserShopInfo'
import Product from './Product'

const CreateProduct = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
    } = props

    const userShopInfoState = UserShopInfo.useState()

    if (userShopInfoState.productAuthority === 'ALL') {
        return <Product
            deviceType={deviceType}
            shop_id={userShopInfoState.shop.id}
        />
    } else {
        return <Redirect to='/'/>
    }
})

export default CreateProduct