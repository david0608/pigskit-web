import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { gql } from 'apollo-boost'
import { QueryProvider, queryComponent, useQueryContext } from '../../utils/apollo'
import Terminal from '../../components/Terminal'
import Abstract from '../../components/utils/Abstract'
import CircButton from '../../components/utils/CircButton'
import Image from '../../components/utils/Image'
import Decorate from '../../components/utils/Decorate'
import Loading from '../../components/utils/Loading'
import { DeviderL } from '../../components/utils/Devider'
import UserShopInfo from '../UserShopInfo'
import './index.less'

const Products = React.memo(() => {
    const userShopInfoState = UserShopInfo.useState()

    const newPath = userShopInfoState.productAuthority === 'ALL' ?
        `/create_product` : null

    const Query = useMemo(
        () => queryComponent({
            queryStr: gql`
                query shop_products($shop_id: Uuid, $product_key: Uuid, $product_name: String) {
                    shop {
                        search(id: $shop_id) {
                            products(key: $product_key, name: $product_name) {
                                key
                                name
                                description
                                price
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
            queryVar: {
                shop_id: userShopInfoState.shop.id,
            },
            paramDispatcher: (params) => ({
                product_name: params.searchValue,
            }),
            resReducer: (data) => (data.shop?.search?.[0].products),
        }),
        []
    )

    return (
        <QueryProvider>
            <Terminal
                className='Products'
                newPath={newPath}
                QueryComponent={Query}
                BodyComponent={Body}
            />
        </QueryProvider>
    )
})

const Body = () => {
    const queryContext = useQueryContext()
    const userShopInfoState = UserShopInfo.useState()

    if (!queryContext) return null

    let children = null

    if (queryContext.loading) {
        children = <Loading/>
    } else {
        if (queryContext.error) {
            console.log('Query error:', queryContext.error)
        } else {
            let data = queryContext.data()
            if (data && data.length > 0) {
                children = data.map((e, i) => (
                    <Abstract key={i}>
                        <Outline data={e}/>
                        <Detail data={e} shopId={userShopInfoState.shop.id}/>
                    </Abstract>
                ))
            } else {
                children = <Decorate.Blank className='Blank'>No data.</Decorate.Blank>
            }
        }
    }

    return <Decorate.List className='Products-body'>{children}</Decorate.List>
}

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
            {deviceType !== 'mobile' && <div className='Description'>{data.description}</div>}
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
                <div className='Name'>{data.name}</div>
                <CircButton><MdEdit/></CircButton>
            </div>
            <Image src={`/fs/shop/product/image?shop_id=${shopId}&product_key=${data.key}`}/>
            <div className='Info'>
                <div className='Description'>{data.description}</div>
                <Decorate.Price>{data.price}</Decorate.Price>
            </div>
            {
                data.customizes.map((cus) => {
                    return (
                        <div key={cus.key} className='Customize'>
                            <DeviderL/>
                            <div className='Name'>{cus.name}</div>
                            {cus.description && <div className='Description'>{cus.description}</div>}
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