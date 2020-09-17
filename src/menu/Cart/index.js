import React, { useState, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../../utils/apollo'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import Abstract from '../../components/utils/Abstract'
import TextInput from '../../components/utils/TextInput'
import QuantityInput from '../../components/utils/QuantityInput'
import RectButton from '../../components/utils/RectButton'
import Loading from '../../components/utils/Loading'
import Decorate from '../../components/utils/Decorate'
import { shopProductsActions } from '../../components/store'
import { orderInfoActions } from '../Order'
import './index.less'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'cartInfo',
    queryStr: gql`
        query guest_cart($shopId: Uuid!) {
            guest {
                carts(shopId: $shopId) {
                    items {
                        key
                        productKey
                        name
                        price
                        count
                        remark
                        orderAt
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
    produceResponseData: (data) => ({
        items: data.guest.carts[0].items,
    })
})

export {
    reducer as cartInfoReducer,
    actions as cartInfoActions,
    Controller as CartInfoController,
}

const Cart = connect(
    (state) => {
        let loading = state.cartInfo.loading || state.shopProducts.loading
        let error = state.cartInfo.error || state.shopProducts.error
        let items = []
        let cartTotalPrice = 0
        let cartExpired = false

        if (!loading && !error) {
            for (let item of state.cartInfo.data.items.values()) {
                let price = item.price
                for (let cus of item.customizes.values()) {
                    if (cus.selectionPrice) price += cus.selectionPrice
                }
                let itemTotalPrice = price * item.count

                let prod = state.shopProducts.data.products[item.productKey]
                let itemExpired = !prod || new Date(prod.latest_update) > new Date(item.orderAt)
                items.push({
                    ...item,
                    totalPrice: itemTotalPrice,
                    expired: itemExpired,
                })

                cartTotalPrice += itemTotalPrice
                cartExpired = cartExpired || itemExpired
            }
        }
        
        return {
            shopId: state.shopInfo.id,
            loading: loading,
            error: error,
            items: items,
            totalPrice: cartTotalPrice,
            expired: cartExpired,
        }
    },
    (dispatch) => ({
        refetchCart: () => {
            dispatch(shopProductsActions.refetchAction())
            dispatch(actions.refetchAction())
            dispatch(orderInfoActions.refetchAction())
        },
    })
)((props) => {
    const {
        shopId,
        loading,
        error,
        items,
        totalPrice,
        expired,
        refetchCart,
    } = props

    const [state, setState] = useState({
        busy: false,
        submitError: null
    })

    const abort = useAbort()

    const submitOrder = () => {
        if (state.busy) return

        setState({
            busy: true,
            submitError: null,
        })
        const abortTk = abort.signup()

        axios({
            method: 'POST',
            url: '/api/cart/order',
            data: {
                shop_id: shopId,
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then((res) => {
            refetchCart()
            location.href = `${location.origin}${location.pathname}${location.search}#/orders`
        })
        .catch((err) => {
            if (abortTk.isAborted()) return

            switch (err.response?.data?.type) {
                case 'CartItemExpired':
                    refetchCart()
                    break
                default:
                    setState({
                        submitError: 'Encountered an unknown error, please try again.',
                    })
            }
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setState({ busy: false })
            }
        })
    }

    let itemsElement = null

    if (loading) {
        itemsElement = <Loading/>
    } else if (error) {
        itemsElement = null
    } else if (items.length === 0) {
        itemsElement = <Decorate.Blank className='Blank'>No Item.</Decorate.Blank>
    } else {
        itemsElement = <>
            {
                items.map((item, i) => (
                    <Item
                        key={i}
                        data={item}
                    />
                ))
            }
            <div className='Conclusion'>
                Total : <Decorate.Price>{totalPrice}</Decorate.Price>
            </div>
            {state.submitError && <div className='ErrorHint'>{state.submitError}</div>}
            <RectButton
                onClick={submitOrder}
                disabled={expired}
            >
                submit order
            </RectButton>
        </>
    }

    return (
        <div className='Cart-root'>{itemsElement}</div>
    )
})

const Item = (props) => {
    const {
        data,
    } = props

    const refAbstract = useRef(null)

    if (data.expired) return (
        <ExpiredOutline
            data={data}
        />
    )

    return (
        <Abstract
            ref={refAbstract}
            className='Item'
        >
            <Outline
                data={data}
            />
            <Detail
                refAbstract={refAbstract}
                data={data}
            />
        </Abstract>
    )
}

const ExpiredOutline = connect(
    (state) => ({
        shopId: state.shopInfo.id,
    }),
    (dispatch) => ({
        refetchCart: () => dispatch(actions.refetchAction())
    })
)((props) => {
    const {
        shopId,
        refetchCart,
        data,
    } = props

    const [state, setState] = useState({
        busy: false,
    })

    const abort = useAbort()

    const deleteItem = () => {
        if (state.busy) return

        setState({ busy: true })
        const abortTk = abort.signup()

        axios({
            method: 'DELETE',
            url: '/api/cart/item',
            data: {
                shop_id: shopId,
                item_key: data.key,
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then((res) => {
            refetchCart()
        })
        .catch((err) => {
            console.log('Error', err)
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setState({ busy: false })
            }
        })
    }

    return (
        <div className={clsx('Item', 'Item-outline', 'Expired')}>
            <div className='Name'>
                {data.name}
            </div>
            <Decorate.DevideList className='Customizes'>
                {
                    data.customizes.map((cus, i) => (
                        <OutlineCustomize key={i} data={cus}/>
                    ))
                }
            </Decorate.DevideList>
            {data.remark ? <div className='Remark'>{data.remark}</div> : null}
            <div className='Footer'>
                <div className='Quantity'>
                    Quantity: {data.count}
                </div>
                <Decorate.Price>{data.totalPrice}</Decorate.Price>
            </div>
            <div className='ErrorHint'>
                This item has expired.
            </div>
            <RectButton onClick={deleteItem}>remove</RectButton>
        </div>
    )
})

const Outline = (props) => {
    const {
        data,
    } = props

    return (
        <div className='Item-outline'>
            <div className='Name'>
                {data.name}
            </div>
            <Decorate.DevideList className='Customizes'>
                {
                    data.customizes.map((cus, i) => (
                        <OutlineCustomize key={i} data={cus}/>
                    ))
                }
            </Decorate.DevideList>
            {data.remark ? <div className='Remark'>{data.remark}</div> : null}
            <div className='Footer'>
                <div className='Quantity'>
                    Quantity: {data.count}
                </div>
                <Decorate.Price>{data.totalPrice}</Decorate.Price>
            </div>
        </div>
    )
}

const OutlineCustomize = (props) => {
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

const Detail = connect(
    (state) => ({
        shopId: state.shopInfo.id,
    }),
    (dispatch) => ({
        refetchCart: () => dispatch(actions.refetchAction())
    })
)((props) => {
    const {
        shopId,
        refetchCart,
        refAbstract,
        data,
    } = props

    const [state, setState] = useState({
        busy: false,
        error: false,
    })

    const abort = useAbort()

    const refRemark = useRef(null)
    const refQuantity = useRef(null)
    
    const handleCommit = useCallback(
        () => {
            if (state.busy) return

            setState({
                busy: true,
                error: false,
            })

            const abortTk = abort.signup()
            axios({
                method: 'PATCH',
                url: '/api/cart/item',
                data: {
                    shop_id: shopId,
                    item_key: data.key,
                    payload: JSON.stringify({
                        remark: refRemark.current.value,
                        count: refQuantity.current.value,
                    })
                },
                cancelToken: abortTk.axiosCancelTk(),
            })
            .then((res) => {
                refetchCart()
                refAbstract.current.blur()
            })
            .catch((err) => {
                console.log('Error', err.response)
                if (abortTk.isAborted()) return
                setState({ error: true })
            })
            .finally(() => {
                if (!abortTk.isAborted()) {
                    abort.signout(abortTk)
                    setState({ busy: false })
                }
            })
        },
        [state.busy]
    )

    const handleCancel = useCallback(
        () => refAbstract.current.blur(),
        []
    )

    const handleDelete = useCallback(
        () => {
            if (state.busy) return

            setState({
                busy: true,
                error: false,
            })

            const abortTk = abort.signup()
            axios({
                method: 'DELETE',
                url: '/api/cart/item',
                data: {
                    shop_id: shopId,
                    item_key: data.key,
                },
                cancelToken: abortTk.axiosCancelTk(),
            })
            .then((res) => {
                refetchCart()
                refAbstract.current.blur()
            })
            .catch((err) => {
                console.log('Error', err.response)
                if (abortTk.isAborted()) return
                setState({ error: true })
            })
            .finally(() => {
                if (!abortTk.isAborted()) {
                    abort.signout(abortTk)
                    setState({ busy: false })
                }
            })
        },
        [state.busy]
    )
    
    return (
        <div className='Item-detail'>
            <div className='Header'>
                <div className='Name'>
                    {data.name}
                </div>
                <Decorate.Price>
                    {data.price}
                </Decorate.Price>
            </div>
            <Decorate.DevideList className='Customizes'>
                {
                    data.customizes.map((cus, i) => (
                        <DetailCustomize key={i} data={cus}/>
                    ))
                }
            </Decorate.DevideList>
            <TextInput
                ref={refRemark}
                label='Remark'
                defaultValue={data.remark}
                multiline
            />
            <div className='Quantity'>
                <div className='Label'>
                    Quantity:
                </div>
                <QuantityInput
                    ref={refQuantity}
                    defaultValue={data.count}
                    minValue={1}
                />
            </div>
            <RectButton className='Ok' onClick={handleCommit}>ok</RectButton>
            <RectButton className='Cancel' onClick={handleCancel}>cancel</RectButton>
            <RectButton className='Delete' onClick={handleDelete}>delete</RectButton>
        </div>
    )
})

const DetailCustomize = (props) => {
    const {
        data,
    } = props

    return (
        <div className='Customize'>
            <div className='Name'>
                {data.name}
            </div>
            <div className='Selection'>
                <div className='Name'>
                    {data.selection}
                </div>
                <Decorate.Price>
                    {data.selectionPrice}
                </Decorate.Price>
            </div>
        </div>
    )
}

export default Cart