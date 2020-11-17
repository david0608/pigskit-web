import React, { useState, useEffect, useRef, useMemo } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../../utils/apollo'
import { sort } from '../../utils/sort'
import Terminal from '../../components/Terminal'
import Abstract from '../../components/utils/Abstract'
import Decorate from '../../components/Decorate'
import { Loading } from '../../components/Loading'
import '../../styles/text.less'
import './index.less'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'shopOrders',
    queryStr: gql`
        query shop_orders($shopId: Uuid!) {
            user {
                me {
                    shops(id: $shopId) {
                        orders {
                            id
                            orderNumber
                            orderAt
                            items {
                                key
                                name
                                price
                                remark
                                count
                                customizes {
                                    name
                                    selection
                                    selectionPrice
                                }
                            }
                        }
                    }
                }
            }
        }
    `,
    produceDefaultVariables: state => ({
        shopId: state.userShop.data.shop.id
    }),
    produceResponseData: data => {
        let orders = data.user.me.shops[0]?.orders || []
        for (let order of orders.values()) {
            let orderTotalPrice = 0
            let orderTotalCount = 0
            for (let item of order.items.values()) {
                let itemPrice = item.price
                for (let cus of item.customizes.values()) {
                    if (cus.selectionPrice) itemPrice += cus.selectionPrice
                }
                item.totalPrice = itemPrice

                orderTotalPrice += itemPrice * item.count
                orderTotalCount += item.count
            }
            order.totalPrice = orderTotalPrice
            order.totalCount = orderTotalCount
        }

        sort({
            arr: orders,
            getKey: e => new Date(e.orderAt)
        })

        return {
            orders: orders
        }
    }
})

export {
    reducer as shopOrdersReducer,
    actions as shopOrdersActions,
    Controller as ShopOrdersController,
}

const Orders = connect(
    state => ({
        loading: state.shopOrders.loading,
        data: state.shopOrders.data
    })
)(props => {
    const {
        loading,
        data,
    } = props

    const [ready, setReady] = useState(!loading)

    const memo = useMemo(() => ({
        prevLoading: false,
        currLoading: false,
    }), [])

    const refPoll = useRef(null)

    const refetch = () => {
        if (loading || !ready) return

        memo.prevLoading = false,
        memo.currLoading = false,
        setReady(false)
        refPoll.current.poll()
    }

    useEffect(() => {
        memo.prevLoading = memo.currLoading
        memo.currLoading = loading
        if (memo.prevLoading && !memo.currLoading) {
            setReady(true)
        }
    }, [loading])

    return (
        <>
            <Terminal
                className='Orders-root'
                refreshProps={{
                    onClick: refetch
                }}
                BodyComponent={OrdersBody}
                bodyProps={{ loading: !ready }}
            />
            <PollOrders forwardRef={refPoll} timeout={3000}/>
        </>
    )
})

const OrdersBody = connect(
    state => ({
        data: state.shopOrders.data,
    }),
)(props => {
    const {
        loading,
        data,
    } = props

    let ordersElement = null

    if (loading) {
        ordersElement = <Loading/>
    } else {
        let orders = data.orders || []
        if (orders.length === 0) {
            ordersElement = <Decorate.Blank>No order.</Decorate.Blank>
        } else {
            ordersElement = orders.map((order, i) => (
                <Abstract key={i}>
                    <Outline
                        data={order}
                    />
                    <Detail
                        data={order}
                    />
                </Abstract>
            ))
        }
    }

    return <Decorate.List className='Orders-body'>{ordersElement}</Decorate.List>
})

const Outline = props => {
    const {
        data,
    } = props

    return (
        <div className={clsx('DataField', 'Order-outline')}>
            <div className='Text_content_enlarge'>
                No.{data.orderNumber}
            </div>
            <div className={clsx('Right', 'OrderAt', 'Text_remark')}>
                {(new Date(data.orderAt).toLocaleString('en'))}
            </div>
        </div>
    )
}

const Detail = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        data,
        deviceType
    } = props

    return (
        <div className={clsx('Order-detail', deviceType)}>
            <div className='Text_header_2nd'>
                No.{data.orderNumber}
            </div>
            {
                data.items.map((item, i) => (
                    <Item
                        key={i}
                        data={item}
                        deviceType={deviceType}
                    />
                ))
            }
            <div className='DataField'>
                Order at :
                <div className={clsx('Right', deviceType === 'mobile' && 'Text_fine')}>
                    {(new Date(data.orderAt)).toLocaleString('en')}
                </div>
            </div>
            <div className='DataField'>
                Total&nbsp;:&nbsp;
                <Decorate.Price className='Right'>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
        </div>
    )
})

const Item = props => {
    const {
        data,
        deviceType,
    } = props

    const isMobile = deviceType === 'mobile'

    return (
        <div className='Item'>
            <div className='DataField'>
                <span>
                    {data.name}
                </span>
                <Decorate.Price className={clsx('Right', isMobile && 'Text_fine')}>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
            {
                data.customizes.map((cus, i) => (
                    <Customize
                        key={i}
                        data={cus}
                        deviceType={deviceType}
                    />
                ))
            }
            {data.remark && <div className='Text_fine' children={data.remark}/>}
            <div className={clsx('Quantity', isMobile && 'Text_fine')}>
                Quantity&nbsp;:&nbsp;{data.count}
            </div>
        </div>
    )
}

const Customize = props => {
    const {
        data,
        deviceType,
    } = props

    const isMobile = deviceType === 'mobile'

    return (
        <div className={clsx('DataField', 'Customize', isMobile && 'Text_fine')}>
            <div>
                {data.name}
            </div>
            <div className='Right'>
                {data.selection}
            </div>
        </div>
    )
}

class PollOrdersComponent extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
        this.pollOnTimeOut()
    }

    componentWillUnmount() {
        this.stopPolling()
    }

    pollOnTimeOut() {
        clearTimeout(this.lastTimeout)
        this.lastTimeout = setTimeout(() => {
            this.props.refetch()
            this.pollOnTimeOut()
        }, this.props.timeout);
    }

    poll() {
        clearTimeout(this.lastTimeout)
        this.props.refetch()
        this.pollOnTimeOut()
    }

    stopPolling() {
        clearTimeout(this.lastTimeout)
    }

    render() {
        return null
    }
}

const PollOrders = connect(
    () => ({}),
    dispatch => ({
        refetch: () => dispatch(actions.refetchAction()),
    }),
)(PollOrdersComponent)

export default Orders