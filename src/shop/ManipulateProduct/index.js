import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { Client } from '../../utils/apollo'
import axios from '../../utils/axios'
import Loading from '../../components/utils/Loading'
import Payload from '../../utils/payload'
import Product from './Product'

export const CreateProduct = () => (
    <CheckAuthority>
        <Create/>
    </CheckAuthority>
)

export const EditProduct = () => (
    <CheckAuthority>
        <Edit/>
    </CheckAuthority>
)

const Create = connect(
    state => ({
        shopId: state.userShop.data.shop.id,
    })
)(props => {
    const {
        shopId,
    } = props

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

const Edit = connect(
    state => ({
        shopId: state.userShop.data.shop.id,
    })
)(props => {
    const {
        shopId,
    } = props

    const {
        productKey,
    } = useParams()

    const refProduct = useRef()

    const client = useMemo(() => new Client(), [])

    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState(null)

    useEffect(
        () => {
            if (payload || loading) return

            setLoading(true)

            client.query({
                query: gql`
                    query shop_product($shopId: Uuid!, $productKey: Uuid!) {
                        shop {
                            search(id: $shopId) {
                                productsJson(key: $productKey)
                            }
                        }
                    }
                `,
                fetchPolicy: 'network-only',
                variables: {
                    shopId: shopId,
                    productKey: productKey,
                },
            })
            .then(res => {
                const product = Object.values(JSON.parse(res.data.shop.search[0].productsJson))[0]
                if (!product) return
                setPayload(buildPayload(product))
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setLoading(false)
            })
        },
        []
    )

    const submit = (cancelToken) => {
        return Promise.resolve()
        .then(() => {
            const formData = new FormData()
            formData.append('shop_id', shopId)
            formData.append('product_key', productKey)
            formData.append('payload', JSON.stringify(payload.reduce()))
            if (refProduct.current.deleteImage) {
                formData.append('delete_image', true)
            }
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
                method: 'PATCH',
                url: '/api/shop/product',
                data: formData,
                cancelToken: cancelToken,
            })
        })
    }

    if (loading) {
        return <Loading/>
    } else if (payload) {
        return (
            <Product
                forwardRef={refProduct}
                payload={payload}
                submit={submit}
                title='Edit product'
                originImageSrc={`/api/shop/product/image?shop_id=${shopId}&product_key=${productKey}`}
            />
        )
    } else {
        return null
    }
})

const CheckAuthority = connect(
    state => ({
        authority: state.userShop.data.productAuthority,
    })
)(props => {
    const {
        authority,
        children,
    } = props

    if (authority === 'ALL') {
        return children
    } else {
        return <Redirect to='/'/>
    }
})

function buildPayload(product) {
    const {
        customizes,
        ...data
    } = product
    const productPayload = Payload.updatePayload(data)
    for (let [key, customize] of Object.entries(customizes)) {
        const {
            selections,
            ...data
        } = customize
        productPayload.registerChild('customizes', key, data)
        const customizePayload = productPayload.getChild('customizes', key)
        for (let [key, selection] of Object.entries(selections)) {
            customizePayload.registerChild('selections', key, selection)
        }
    }
    return productPayload
}