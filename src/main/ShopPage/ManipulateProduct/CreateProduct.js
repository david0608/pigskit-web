import React, { useMemo, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../../../utils/axios'
import Payload from '../../../utils/payload'
import Product from './Product'

const CreateProduct = connect(
    state => ({
        shopId: state.userShopInfo.id,
        authority: state.userShopInfo.productAuthority,
    })
)(props => {
    const {
        shopId,
        authority,
    } = props

    if (authority !== 'ALL') return <Redirect to='/'/>

    const refProduct = useRef()

    const payload = useMemo(() => Payload.createPayload({
        name: '',
        price: null,
        description: '',
    }))

    const submit = (cancelToken) => {
        return Promise.resolve()
        .then(() => {
            const formData = new FormData()
            formData.append('shop_id', shopId)
            formData.append('payload', JSON.stringify(payload.reduce()))
            const imageUrl = refProduct.current.imageUrl
            if (imageUrl) {
                return fetch(imageUrl)
                    .then(res => res.blob())
                    .then(image => {
                        formData.append('image', image)
                        return formData
                    })
            } else {
                return formData
            }
        })
        .then(formData => {
            return axios({
                method: 'POST',
                url: '/api/shop/product',
                data: formData,
                cancelToken: cancelToken,
            })
        })
    }

    return (
        <Product
            forwardRef={refProduct}
            payload={payload}
            submit={submit}
            title='Create a new product'
        />
    )
})

export default CreateProduct