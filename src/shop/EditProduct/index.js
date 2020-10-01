import React from 'react'
import { connect } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'

const EditProduct = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShop.data.shop.id,
        authority: state.userShop.data.productAuthority,
    })
)(props => {
    const {
        deviceType,
        shopId,
        authority,
    } = props

    const param = useParams()

    console.log(param)

    if (authority === 'ALL') {
        return 'Edit product is under construction.'
    } else {
        return <Redirect to='/'/>
    }
})

export default EditProduct