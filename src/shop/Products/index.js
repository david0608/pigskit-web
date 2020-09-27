import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../../utils/apollo'
import Terminal from '../../components/Terminal'
import Abstract from '../../components/utils/Abstract'
import CircButton from '../../components/utils/CircButton'
import Image from '../../components/utils/Image'
import Decorate from '../../components/utils/Decorate'
import Loading from '../../components/utils/Loading'
import { DeviderL } from '../../components/utils/Devider'
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
        productElements = <Decorate.Blank>No data.</Decorate.Blank>
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
                <CircButton><MdEdit/></CircButton>
            </div>
            <Image
                url={data.hasPicture && `/fs/shop/product/image?shop_id=${shopId}&product_key=${data.key}`}
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
                            <DeviderL/>
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

export default Products