import React from 'react'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import clsx from 'clsx'
import { createQueryStore } from '../../utils/apollo'
import Abstract from '../../components/utils/Abstract'
import Loading from '../../components/utils/Loading'
import Decorate from '../../components/utils/Decorate'
import { sort } from '../../utils/sort'
import './index.less'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'orderInfo',
    queryStr: gql`
        query guest_orders($shopId: Uuid!) {
            guest {
                orders(shopId: $shopId) {
                    orderNumber
                    orderAt
                    items {
                        name,
                        price,
                        count,
                        remark,
                        customizes {
                            name
                            selection
                            selectionPrice
                        }
                    }
                }
            }
        }
    `,
    produceQueryVariables: (state) => ({
        shopId: state.shopInfo.id,
    }),
    produceResponseData: (data) => {
        for (let order of data.guest.orders.values()) {
            let orderTotalPrice = 0
            let orderTotalCouunt = 0
            for (let item of order.items.values()) {
                let itemPrice = item.price
                for (let cus of item.customizes.values()) {
                    if (cus.selectionPrice) itemPrice += cus.selectionPrice
                }
                item.totalPrice = itemPrice

                orderTotalPrice += itemPrice * item.count
                orderTotalCouunt += item.count
            }
            order.totalPrice = orderTotalPrice
            order.totalCount = orderTotalCouunt
        }

        return {
            orders: sort({
                arr: data.guest.orders,
                getKey: e => new Date(e.orderAt),
            })
        }
    }
})

export {
    reducer as orderInfoReducer,
    actions as orderInfoActions,
    Controller as OrderInfoController,
}

const Orders = connect(
    (state) => ({
        loading: state.orderInfo.loading,
        error: state.orderInfo.error,
        data: state.orderInfo.data,
    })
)((props) => {
    const {
        loading,
        error,
        data,
    } = props

    let ordersElement = null

    if (loading) {
        ordersElement = <Loading/>
    } else if (error) {
        ordersElement = null
    } else {
        let orders = data.orders
        if (orders.length === 0) {
            ordersElement = <Decorate.Blank className='Blank'>No order.</Decorate.Blank>
        } else {
            ordersElement = orders.map((order, i) => (
                <Order
                    key={i}
                    data={order}
                />
            )).reverse()
        }
    }

    return (
        <div className='Orders-root'>{ordersElement}</div>
    )
})

const Order = (props) => {
    const {
        data,
    } = props
    
    return (
        <Abstract
            className='Order'
        >
            <OrderBody
                data={data}
            />
            <OrderBody
                detail
                data={data}
            />
        </Abstract>
    )
}

const OrderBody = (props) => {
    const {
        detail,
        data,
    } = props

    return (
        <Decorate.List className={clsx('Order-body', detail ? 'Detail' : 'Outline')}>
            <div className='Header'>
                No.{data.orderNumber}
                {
                    !detail &&
                    <div className='Right'>
                        {data.totalCount} items
                    </div>
                }
            </div>
            {
                detail && data.items.map((item, i) => (
                    <Item
                        key={i}
                        data={item}
                    />
                ))
            }
            <div className='TotalPrice'>
                Total :
                <Decorate.Price className='Right'>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
            <div className='OrderAt'>
                Order at :
                <div className='Right'>
                    {`${(new Date(data.orderAt)).toLocaleString('en')}`}
                </div>
            </div>
        </Decorate.List>
    )
}

const Item = (props) => {
    const {
        data,
    } = props
    
    return (
        <div className='Item'>
            <div className='Header'>
                <div className='Name'>
                    {data.name}
                </div>
                <Decorate.Price className='Price'>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
            {
                data.customizes.map((cus, i) => (
                    <Customize
                        key={i}
                        data={cus}
                    />
                ))
            }
            {data.remark && <div className='Remark'>{data.remark}</div>}
            <div className='Quantity'>
                Quantity : {data.count}
            </div>
        </div>
    )
}

const Customize = (props) => {
    const {
        data,
    } = props

    return (
        <div className='Customize'>
            <div className='Name'>
                {data.name}
            </div>
            <div className='Selection'>
                {data.selection}
            </div>
        </div>
    )
}

export default Orders