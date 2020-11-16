import React from 'react'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import clsx from 'clsx'
import { createQueryStore } from '../../utils/apollo'
import Abstract from '../../components/utils/Abstract'
import Loading from '../../components/utils/Loading'
import Decorate from '../../components/Decorate'
import { sort } from '../../utils/sort'
import '../../styles/text.less'
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
    produceDefaultVariables: state => ({
        shopId: state.shopInfo.data.id,
    }),
    produceResponseData: data => {
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

        sort({
            arr: data.guest.orders,
            getKey: e => new Date(e.orderAt)
        })

        return {
            orders: data.guest.orders
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
        <Decorate.List className={clsx('Order-body', detail ? 'Detail' : 'Outline', detail ? 'Text_content' : 'Text_fine')}>
            <div className='Header'>
                <div className={clsx(detail ? 'Text_header_2nd' : 'Text_header_3rd')}>
                    No.{data.orderNumber}
                </div>
                {
                    !detail &&
                    <div className='Right'>
                        {data.totalCount}&nbsp;items
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
            <div className='OrderAt'>
                Order at :
                <div className={clsx('Right', 'Text_fine')}>
                    {`${(new Date(data.orderAt)).toLocaleString('en')}`}
                </div>
            </div>
            <div className='TotalPrice'>
                Total&nbsp;:&nbsp;
                <Decorate.Price className='Right'>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
        </Decorate.List>
    )
}

const Item = (props) => {
    const {
        data,
    } = props
    
    return (
        <div className={clsx('Item', 'Text_fine')}>
            <div className='Header'>
                <span className={clsx('Text_content', 'Text_bold')}>
                    {data.name}
                </span>
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
            {data.remark && <span>{data.remark}</span>}
            <div className='Quantity'>
                Quantity&nbsp;:&nbsp;{data.count}
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