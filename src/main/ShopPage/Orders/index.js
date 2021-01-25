import React, { useEffect, useRef, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { actions as shopOrdersActions } from '../../../store/shop_orders'
import Terminal from '../../../components/Terminal'
import Decorate from '../../../components/Decorate'
import { Loading } from '../../../components/Loading'
import Entry from './Entry'

const Orders = connect(
    state => ({
        loading: state.shopOrders.loading,
    })
)(props => {
    const {
        loading,
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
                refreshProps={{
                    onClick: refetch
                }}
                bodyProps={{
                    loading: !ready
                }}
                BodyComponent={OrdersBody}
            />
            <PollOrders forwardRef={refPoll} timeout={3000}/>
        </>
    )
})

const OrdersBodyRoot = styled(Decorate.List)`
    >.Blank {
        background-color: #f9f9f9;
    }
`

const OrdersBody = connect(
    state => ({
        orders: state.shopOrders.orders,
    })
)(props => {
    const {
        loading,
        orders = [],
    } = props

    let ordersElement = null

    if (loading) {
        ordersElement = <Loading />
    } else {
        if (orders.length === 0) {
            ordersElement = <Decorate.Blank className='Blank'>No order.</Decorate.Blank>
        } else {
            ordersElement = orders.map((order, i) => (
                <Entry
                    key={i}
                    data={order}
                />
            ))
        }
    }

    return <OrdersBodyRoot>{ordersElement}</OrdersBodyRoot>
})

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
        this.lastTimeout = setTimeout(
            () => {
                this.props.refetch()
                this.pollOnTimeOut()
            },
            this.props.timeout
        )
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
        refetch: () => dispatch(shopOrdersActions.refetch())
    })
)(PollOrdersComponent)

export default Orders