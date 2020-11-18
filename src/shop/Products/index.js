import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../../utils/apollo'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import Terminal from '../../components/Terminal'
import Abstract from '../../components/Abstract'
import { FloatList, FloatItem } from '../../components/utils/FloatList'
import Button from '../../components/Button'
import CircButton from '../../components/utils/CircButton'
import { Image } from '../../components/Image'
import Decorate from '../../components/Decorate'
import { Loading } from '../../components/Loading'
import Devider from '../../components/Devider'
import '../../styles/text.less'
import './index.less'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'shopProducts',
    queryStr: gql`
        query shop_products($shopId: Uuid!, $productKey: Uuid, $productName: String) {
            shop {
                search(id: $shopId) {
                    products(key: $productKey, name: $productName) {
                        key
                        name
                        description
                        price
                        hasPicture
                        latestUpdate
                        customizes {
                            key
                            name
                            description
                            latestUpdate
                            selections {
                                key
                                name
                                price
                            }
                        }
                    }
                }
            }
        }
    `,
    produceDefaultVariables: state => ({
        shopId: state.userShop.data.shop.id,
    }),
    produceResponseData: data => ({
        products: data.shop?.search?.[0].products,
    })
})

export {
    reducer as shopProductsReducer,
    actions as shopProductsActions,
    Controller as ShopProductsController,
}

const Products = connect(
    state => ({
        variables: state.shopProducts.variables,
        productAuthority: state.userShop.data.productAuthority,
    }),
    dispatch => ({
        refetch: variables => dispatch(actions.refetchAction(variables))
    })
)(props => {
    const {
        variables,
        productAuthority,
        refetch,
    } = props

    const newProps = productAuthority === 'ALL' ?
        { url: `${location.origin}${location.pathname}${location.search}#/create_product` } :
        undefined

    const searchProps = {
        defaultValue: variables.productName,
        onCommit: value => refetch({ productName: value }),
    }

    return (
        <Terminal
            className='Products-root'
            newProps={newProps}
            searchProps={searchProps}
            BodyComponent={Body}
        />
    )
})

const Body = connect(
    state => ({
        loading: state.shopProducts.loading,
        error: state.shopProducts.error,
        products: state.shopProducts.data.products,
        shopId: state.userShop.data.shop.id,
    })
)(props => {
    const {
        loading,
        error,
        products = [],
        shopId,
    } = props

    let productElements = null
    
    if (loading) {
        productElements = <Loading/>
    } else if (error) {
        productElements = null
    } else if (products.length === 0) {
        productElements = <Decorate.Blank className='Blank'>No data.</Decorate.Blank>
    } else {
        productElements = products.map((prod, i) => (
            <Abstract key={i}>
                <Outline data={prod}/>
                <Detail data={prod} shopId={shopId}/>
            </Abstract>
        ))
    }

    return <Decorate.List className='Products-body'>{productElements}</Decorate.List>
})

const Outline = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        data,
    } = props
    
    return (
        <div className={clsx('Product-outline', deviceType)}>
            <div className='Name'>{data.name}</div>
            {deviceType !== 'mobile' && <span className={clsx('Description', 'Text_remark')}>{data.description}</span>}
            <Decorate.Price className='Price'>{data.price}</Decorate.Price>
        </div>
    )
})

const Detail = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        data,
        shopId,
    } = props
    
    return (
        <div className={clsx('Product-detail', deviceType)}>
            <div className='Title'>
                <span className={clsx('Name', 'Text_header_2nd')}>{data.name}</span>
                <CircButton
                    onClick={() => location.href = `${location.origin}${location.pathname}${location.search}#/edit_product/${data.key}`}
                    children={<MdEdit/>}
                />
                &emsp;
                <FloatList
                    className='Delete'
                    rightAligned
                    label={<CircButton children={<IoMdTrash/>}/>}
                    children={
                        <DeleteProduct
                            shopId={shopId}
                            productKey={data.key}
                        />
                    }
                />
            </div>
            <Image
                url={data.hasPicture && `/api/shop/product/image?shop_id=${shopId}&product_key=${data.key}`}
                presize
            />
            <div className='Info'>
                <span className={clsx('Description', 'Text_remark')}>{data.description}</span>
                <Decorate.Price>{data.price}</Decorate.Price>
            </div>
            {
                data.customizes.map((cus) => {
                    return (
                        <div key={cus.key} className='Customize'>
                            <Devider.Light/>
                            <div className={clsx('Name', 'Text_header_3rd')}>{cus.name}</div>
                            {cus.description && <div className={clsx('Description', 'Text_remark')}>{cus.description}</div>}
                            {
                                cus.selections.map((sel) => {
                                    return (
                                        <div key={sel.key} className='Selection'>
                                            <div className='Name'>{sel.name}</div>
                                            <Decorate.Price>{sel.price}</Decorate.Price>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
})

const DeleteProduct = connect(
    () => ({}),
    dispatch => ({
        refetchProducts: () => dispatch(actions.refetchAction()),
    })
)(props => {
    const {
        shopId,
        productKey,
        refetchProducts,
    } = props

    const [state, setState] = useState({
        busy: false,
        error: '',
    })

    const refFloatItemYes = useRef(null)

    const abort = useAbort()

    const deleteProduct = () => {
        if (state.busy) return
        setState({
            busy: true,
            error: '',
        })

        const abortTk = abort.signup()
        axios({
            method: 'DELETE',
            url: '/api/shop/product',
            data: {
                shop_id: shopId,
                product_key: productKey,
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            if (abortTk.isAborted()) return
            refFloatItemYes.current.startFold()
            refetchProducts()
        })
        .catch(err => {
            console.error(err)
            if (abortTk.isAborted()) return
            switch (err.response.data.type) {
                case 'Unauthorized':
                    setState({ error: 'Permission denied. Please check.' })
                    break
                default:
                    setState({ error: 'Encountered an unknown error. Please try again.' })
            }
            setState({ error: true })
        })
        .finally(() => {
            if (abortTk.isAborted()) return
            setState({ busy: false })
        })
    }

    return (
        <div className='DeleteProduct-root'>
            Are you sure to delete the product?
            {state.error && <div className={clsx('Text_error', 'Text_fine')}>{state.error}</div>}
            <div className='Footer'>
                <FloatItem
                    children={<Button children='No'/>}
                />
                <FloatItem
                    ref={refFloatItemYes}
                    manualFold
                    children={
                        <Button
                            onClick={deleteProduct}
                            children='Yes'
                            loading={state.busy}
                        />
                    }
                />
            </div>
        </div>
    )
})

export default Products