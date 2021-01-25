import React, { useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
import { StoreProvider } from '../store'
import { reducer as deviceInfoReducer } from '../store/device_info'
import { reducer as guestSessionReducer, actions as guestSessionActions} from '../store/guest_session'
import { reducer as guestCartReducer, actions as guestCartActions } from '../store/guest_cart'
import { reducer as guestOrderReducer, actions as guestOrderActions } from '../store/guest_order'
import { reducer as menuShopInfoReducer, actions as menuShopInfoActions } from '../store/menu_shop_info'
import { reducer as menuShopProductsReducer, actions as menuShopProductsActions } from '../store/menu_shop_products'
import { Client as GraphqlClient } from '../utils/apollo'
import axios from '../utils/axios'
import { sort } from '../utils/sort'
import MeasureScreen from '../components/MeasureScreen'
import TopBar from './TopBar'
import Menu from './Menu'
import Cart from './Cart'
import Orders from './Orders'
import '../styles/text.less'

const MenuPage = styled.div`
    max-width: 498px;
    margin: 32px auto;
    padding: 0 8px;
`

const App = props => (
    <StoreProvider
        reducers={{
            deviceInfo: deviceInfoReducer,
            guestSession: guestSessionReducer,
            guestCart: guestCartReducer,
            guestOrder: guestOrderReducer,
            menuShopInfo: menuShopInfoReducer,
            menuShopProducts: menuShopProductsReducer,
        }}
    >
        <MenuShopInfoProvider>
            <GuestSessionProvider>
                <MenuShopProductsController/>
                <GuestCartController/>
                <GuestOrderController/>
                <MeasureScreen>
                    {props.children}
                </MeasureScreen>
            </GuestSessionProvider>
        </MenuShopInfoProvider>
    </StoreProvider>
)

const MenuShopInfoProvider = connect(
    state => ({
        inited: state.menuShopInfo.inited,
    }),
    dispatch => ({
        init: data => dispatch(menuShopInfoActions.response(data))
    })
)(props => {
    const {
        inited,
        init,
        children,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (inited) return

        const url = new URL(location.href)
        const search = new URLSearchParams(url.search)
        const shopId = search.get('id')

        client.query({
            query: gql`
                query menu_shop_info($shopId: Uuid!) {
                    shop {
                        search(id: $shopId) {
                            id
                            name
                            latestUpdate
                        }
                    }
                }
            `,
            fetchPolicy: 'network-only',
            variables: {
                shopId: shopId,
            }
        })
        .then(res => {
            const data = res.data.shop.search[0]
            if (!data) throw new Error('Shop not found.')
            init({
                id: data.id,
                name: data.name,
                latestUpdate: data.latestUpdate,
            })
        })
        .catch(err => {
            console.error(err)
        })
    })

    if (inited) {
        return children
    } else {
        return null
    }
})

const MenuShopProductsController = connect(
    state => ({
        shopId: state.menuShopInfo.id,
        inited: state.menuShopProducts.inited,
        refetch: state.menuShopProducts.refetch,
    }),
    dispatch => ({
        loading: () => dispatch(menuShopProductsActions.loading()),
        init: data => dispatch(menuShopProductsActions.response(data)),
        error: () => dispatch(menuShopProductsActions.error()),
    })
)(props => {
    const {
        shopId,
        inited,
        refetch,
        loading,
        init,
        error,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (inited && !refetch) return

        loading()

        client.query({
            query: gql`
                query menu_shop_product($shopId: Uuid!) {
                    shop {
                        search(id: $shopId) {
                            productsJson
                        }
                    }
                }
            `,
            fetchPolicy: 'network-only',
            variables: {
                shopId: shopId,
            }
        })
        .then(res => {
            const data = res.data.shop.search[0]
            if (!data) throw new Error('Shop not found.')
            init({
                products: { ...JSON.parse(data.productsJson) }
            })
        })
        .catch(err => {
            console.error(err)
            error()
        })
    })

    return null
})

const GuestSessionProvider = connect(
    state => ({
        inited: state.guestSession.inited,
        shopId: state.menuShopInfo.id,
    }),
    dispatch => ({
        init: () => dispatch(guestSessionActions.init())
    })
)(props => {
    const {
        inited,
        shopId,
        init,
        children,
    } = props

    useEffect(() => {
        if (inited) return

        axios({
            method: 'PUT',
            url: '/api/cart',
            data: {
                shop_id: shopId,
            }
        })
        .then(() => {
            init()
        })
        .catch(err => {
            console.error('Failed to init guest session.', err)
        })
    }, [])

    if (inited) {
        return children
    } else {
        return null
    }
})

const GuestCartController = connect(
    state => ({
        shopId: state.menuShopInfo.id,
        inited: state.guestCart.inited,
        refetch: state.guestCart.refetch,
    }),
    dispatch => ({
        loading: () => dispatch(guestCartActions.loading()),
        init: data => dispatch(guestCartActions.response(data)),
        error: () => dispatch(guestCartActions.error()),
    })
)(props => {
    const {
        shopId,
        inited,
        refetch,
        loading,
        init,
        error,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (inited && !refetch) return

        loading()

        client.query({
            query: gql`
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
            fetchPolicy: 'network-only',
            variables: {
                shopId: shopId,
            }
        })
        .then(res => {
            const data = res.data.guest.carts[0]
            if (!data) throw new Error('Shop not found.')
            init({
                items: data.items
            })
        })
        .catch(err => {
            console.error(err)
            error()
        })
    })

    return null
})

const GuestOrderController = connect(
    state => ({
        shopId: state.menuShopInfo.id,
        inited: state.guestOrder.inited,
        refetch: state.guestOrder.refetch,
    }),
    dispatch => ({
        loading: () => dispatch(guestOrderActions.loading()),
        init: data => dispatch(guestOrderActions.response(data)),
        error: () => dispatch(guestOrderActions.error())
    })
)(props => {
    const {
        shopId,
        inited,
        refetch,
        loading,
        init,
        error,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (inited && !refetch) return

        loading()

        client.query({
            query: gql`
                query guest_order($shopId: Uuid!) {
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
            fetchPolicy: 'network-only',
            variables: {
                shopId: shopId,
            }
        })
        .then(res => {
            const orders = res.data.guest.orders
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
            
            init({
                orders: orders
            })
        })
        .catch(err => {
            console.error(err)
            error()
        })
    })

    return null
})

ReactDOM.render(
    <App>
        <HashRouter>
            <TopBar/>
            <MenuPage>
                <Switch>
                    <Route path='/cart'>
                        <Cart/>
                    </Route>
                    <Route path='/orders'>
                        <Orders/>
                    </Route>
                    <Route path='/'>
                        <Menu/>
                    </Route>
                </Switch>
            </MenuPage>
        </HashRouter>
    </App>,
    document.getElementById('root')
)