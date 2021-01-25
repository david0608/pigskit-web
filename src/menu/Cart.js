import React, { useState, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import styled from 'styled-components'
import { actions as menuShopProductsActions } from '../store/menu_shop_products'
import { actions as guestCartActions } from '../store/guest_cart'
import { actions as guestOrderActions } from '../store/guest_order'
import axios from '../utils/axios'
import { useAbort } from '../utils/abort'
import Abstract from '../components/Abstract'
import TextInput from '../components/TextInput'
import QuantityInput from '../components/QuantityInput'
import RectButton from '../components/RectButton'
import Button from '../components/Button'
import { Loading } from '../components/Loading'
import Decorate from '../components/Decorate'

const CartRoot = styled.div`
    .Price {
        margin-left: auto;
    }

    >.Item {
        border-radius: 4px;
        border: solid 1px #dcdcdc;
        margin-top: 8px;
    }

    >.Conclusion {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;

        >.Price {
            margin-left: unset;
        }
    }

    .ErrorHint {
        margin-top: 16px;
    }

    .MuiButton-root {
        margin-top: 8px;
        height: 32px;
        width: 100%;
    }

    .Item-outline {
        padding: 8px 16px;
    
        &.Expired {
            background-color: #f9f9f9;
            color: rgba(0, 0, 0, 0.3);
    
            .Price {
                color: rgba(0, 0, 0, 0.3);
            }
        }
    
        >.Customizes {
            margin-top: 8px;
    
            >.Customize {
                padding: 4px 24px;
                display: flex;
                flex-wrap: wrap;
            
                >.Selection {
                    margin-left: auto;
                }
            }
        }
    
        >.Remark {
            margin-top: 8px;
        }
    
        >.Footer {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
        }
    }
    
    .Item-detail {
        padding: 32px 16px 38px;
    
        >.Header {
            display: flex;
            flex-wrap: wrap;
        }
    
        >.Customizes {
            margin-top: 16px;
    
            >.Customize {
                padding: 8px 0px 8px 16px;
    
                >.Selection {
                    margin-top: 4px;
                    padding: 0 0 0 16px;
                    display: flex;
                    flex-wrap: wrap;
                }
            }
        }
    
        >.MuiTextField-root {
            width: 100%;
            margin-top: 24px;
        }
    
        >.Quantity {
            margin: 24px auto 0 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
    
            >.Label {
                margin-right: 12px;
            }
    
            >.QuantityInput-root {
                width: 180px;
            }
        }
    
        >.Footer {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
    
            button {
                width: 64px;
                height: 32px;
    
                &:not(:first-child) {
                    margin-left: 8px;
                }
    
                &.Left {
                    margin-right: auto;
                }
            }
        }
    }
`

const Cart = connect(
    state => {
        let loading = state.guestCart.loading || state.menuShopProducts.loading
        let error = state.guestCart.error || state.menuShopProducts.error
        let items = []
        let cartTotalPrice = 0
        let cartExpired = false

        if (!loading && !error) {
            for (let item of state.guestCart.items.values()) {
                let price = item.price
                for (let cus of item.customizes.values()) {
                    if (cus.selectionPrice) price += cus.selectionPrice
                }
                let itemTotalPrice = price * item.count

                let prod = state.menuShopProducts.products[item.productKey]
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
            shopId: state.menuShopInfo.id,
            loading: loading,
            error: error,
            items: items,
            totalPrice: cartTotalPrice,
            expired: cartExpired,
        }
    },
    dispatch => ({
        refetchCart: () => {
            dispatch(menuShopProductsActions.refetch())
            dispatch(guestCartActions.refetch())
            dispatch(guestOrderActions.refetch())
        }
    })
)(props => {
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
                Total : <Decorate.Price className='Price'>{totalPrice}</Decorate.Price>
            </div>
            {state.submitError && <div className={clsx('ErrorHint', 'Text_error')}>{state.submitError}</div>}
            <RectButton onMouseDown={submitOrder} disabled={expired} loading={state.busy}>submit order</RectButton>
        </>
    }

    return (
        <CartRoot>{itemsElement}</CartRoot>
    )
})

const Item = props => {
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
    state => ({
        shopId: state.menuShopInfo.id,
    }),
    dispatch => ({
        refetchCart: () => dispatch(guestCartActions.refetch())
    })
)(props => {
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
            {data.remark && <div className={clsx('Remark', 'Text_fine')}>{data.remark}</div>}
            <div className='Footer'>
                <span className='Text_fine'>
                    Quantity : {data.count}
                </span>
                <Decorate.Price className='Price'>{data.totalPrice}</Decorate.Price>
            </div>
            <div className={clsx('ErrorHint', 'Text_error')}>
                This item has expired.
            </div>
            <RectButton onClick={deleteItem} loading={state.busy}>remove</RectButton>
        </div>
    )
})

const Outline = props => {
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
            {data.remark && <div className={clsx('Remark', 'Text_fine')}>{data.remark}</div>}
            <div className='Footer'>
                <span className='Text_fine'>
                    Quantity : {data.count}
                </span>
                <Decorate.Price className='Price'>{data.totalPrice}</Decorate.Price>
            </div>
        </div>
    )
}

const OutlineCustomize = props => {
    const {
        data,
    } = props

    return (
        <div className={clsx('Customize', 'Text_fine')}>
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
    state => ({
        shopId: state.menuShopInfo.id,
    }),
    dispatch => ({
        refetchCart: () => dispatch(guestCartActions.refetch()),
    })
)(props => {
    const {
        shopId,
        refetchCart,
        refAbstract,
        data,
    } = props

    const [state, setState] = useState({
        busy: '',
        error: false,
    })

    const abort = useAbort()

    const refRemark = useRef(null)
    const refQuantity = useRef(null)
    
    const handleCommit = useCallback(
        () => {
            if (state.busy) return

            setState({
                busy: 'COMMIT',
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
                    setState({ busy: '' })
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
                busy: 'DELETE',
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
                    setState({ busy: '' })
                }
            })
        },
        [state.busy]
    )
    
    return (
        <div className='Item-detail'>
            <div className='Header'>
                <span className='Text_header_2nd'>
                    {data.name}
                </span>
                <Decorate.Price className='Price'>
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
                <div className={clsx('Label', 'Text_bold')}>
                    Quantity :
                </div>
                <QuantityInput
                    ref={refQuantity}
                    defaultValue={data.count}
                    minValue={1}
                />
            </div>
            <div className='Footer'>
                <Button
                    className='Left'
                    onClick={handleDelete}
                    loading={state.busy === 'DELETE'}
                    children='Delete'
                />
                <Button
                    onClick={handleCancel}
                    children='Cancel'
                />
                <Button
                    onClick={handleCommit}
                    loading={state.busy === 'COMMIT'}
                    children='Ok'
                />
            </div>
        </div>
    )
})

const DetailCustomize = props => {
    const {
        data,
    } = props

    return (
        <div className='Customize'>
            <span className='Text_header_3rd'>
                {data.name}
            </span>
            {
                data.selection &&
                <div className='Selection'>
                    <div className='Name'>
                        {data.selection}
                    </div>
                    <Decorate.Price className='Price'>
                        {data.selectionPrice}
                    </Decorate.Price>
                </div>
            }
        </div>
    )
}

export default Cart