import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import styled from 'styled-components'
import Abstract from '../components/Abstract'
import { Loading } from '../components/Loading'
import Decorate from '../components/Decorate'

const OrdersRoot = styled.div`
    >.Order {
        border-radius: 4px;
        border: solid 1px #dcdcdc;
        margin-top: 8px;

        .Order-body {
            border: unset;
        
            &.Outline {
                padding: 8px 16px;
        
                >.Header {
                    align-items: center;
                }
            }
        
            &.Detail {
                padding: 24px 16px 28px;
        
                >.OrderAt {
                    align-items: center;
                }
            }
        
            >.Header, >.TotalPrice, >.OrderAt {
                padding: 8px 0px;
                display: flex;
                flex-wrap: wrap;
        
                >.Right {
                    margin-left: auto;
                }
            }
        
            >.Item {
                padding: 8px 0px;
        
                >div {
                    margin: 4px 0px;
                }
        
                >.Header {
                    display: flex;
                    flex-wrap: wrap;
        
                    >.Price {
                        margin-left: auto;
                    }
                }
        
                >.Customize {
                    padding: 0px 24px;
                }
        
                >.Customize {
                    display: flex;
                    flex-wrap: wrap;
        
                    >.Selection {
                        margin-left: auto;
                    }
                }
        
                >.Quantity {
                    text-align: end;
                }
            }
        }
    }
`

const Orders = connect(
    state => ({
        loading: state.guestOrder.loading,
        error: state.guestOrder.error,
        orders: state.guestOrder.orders,
    })
)(props => {
    const {
        loading,
        error,
        orders,
    } = props

    let ordersElement = null

    if (loading) {
        ordersElement = <Loading/>
    } else if (error) {
        ordersElement = null
    } else {
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
        <OrdersRoot>{ordersElement}</OrdersRoot>
    )
})

const Order = props => {
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

const OrderBody = props => {
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

const Item = props => {
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

const Customize = props => {
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