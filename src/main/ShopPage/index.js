import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { actions as userShophopInfoActions } from '../../store/user_shop_info'
import { actions as shopProductsActions } from '../../store/shop_products'
import { actions as shopOrdersActions} from '../../store/shop_orders'
import { Client as GraphqlClient } from '../../utils/apollo'
import { sort } from '../../utils/sort'
import Page from '../../components/Page'
import Path from '../../components/Path'
import Navigator from '../../components/Navigator'
import Outline from './Outline'
import Products from './Products'
import CreateProduct from './ManipulateProduct/CreateProduct'
import EditProduct from './ManipulateProduct/EditProduct'
import Orders from './Orders'

const ShopPage = connect(
    state => ({
        signedIn: state.userInfo.signedIn,
    })
)(props => {
    const {
        signedIn,
    } = props

    if (!signedIn) return <Redirect to='/'/>

    const params = useParams()

    return (<>
        <ShopController shopId={params.shopId}/>
        <ProductsController shopId={params.shopId}/>
        <OrdersController shopId={params.shopId}/>
        <Body/>
    </>)
})

class BodyComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillUnmount() {
        this.props.resetShopInfo()
        this.props.resetShopProducts()
        this.props.resetShopOrders()
    }

    render() {
        const {
            inited,
            loading,
            error,
        } = this.props

        if (!inited || loading || error) {
            return null
        } else {
            return (
                <Page.Root>
                    <HeaderBlock/>
                    <BodyBlock/>
                </Page.Root>
            )
        }
    }
}

const Body = connect(
    state => ({
        inited: state.userShopInfo.inited,
        loading: state.userShopInfo.loading,
        error: state.userShopInfo.error,
    }),
    dispatch => ({
        resetShopInfo: () => dispatch(userShophopInfoActions.reset()),
        resetShopProducts: () => dispatch(shopProductsActions.reset()),
        resetShopOrders: () => dispatch(shopOrdersActions.reset()),
    })
)(BodyComponent)

const HeaderBlock = connect(
    state => ({
        shopName: state.userShopInfo.name,
    })
)(props => {
    const {
        shopName,
    } = props

    return (
        <Page.Block>
            <Path
                path={[
                    {
                        name: shopName,
                    }
                ]}
            />
        </Page.Block>
    )
})

const BodyBlock = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    const match = useRouteMatch()

    const links = [
        {
            name: 'outline',
            to: `${match.url}`,
        },
        {
            name: 'products',
            to: `${match.url}/products`,
        },
        {
            name: 'orders',
            to: `${match.url}/orders`,
        }
    ]

    const isDesktop = deviceType === 'desktop'

    if (isDesktop) {
        return (
            <Page.Block>
                <Page.SideBar>
                    <Navigator vertical={isDesktop} links={links}/>
                </Page.SideBar>
                <Page.Content>
                    <SwitchContent/>
                </Page.Content>
            </Page.Block>
        )
    } else {
        return (
            <>
                <Navigator vertical={isDesktop} links={links}/>
                <Page.Block>
                    <SwitchContent/>
                </Page.Block>
            </>
        )
    }
})

const SwitchContent = () => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/products`}>
                <Products/>
            </Route>
            <Route path={`${match.path}/create_product`}>
                <CreateProduct/>
            </Route>
            <Route path={`${match.path}/edit_product/:productKey`}>
                <EditProduct/>
            </Route>
            <Route path={`${match.path}/orders`}>
                <Orders/>
            </Route>
            <Route path={`${match.path}/`}>
                <Outline/>
            </Route>
        </Switch>
    )
}

const ShopController = connect(
    state => ({
        inited: state.userShopInfo.inited,
        refetch: state.userShopInfo.refetch,
        loading: state.userShopInfo.loading,
    }),
    dispatch => ({
        dispatchLoading: () => dispatch(userShophopInfoActions.loading()),
        dispatchResponse: (data) => dispatch(userShophopInfoActions.response(data)),
        dispatchError: () => dispatch(userShophopInfoActions.error()),
    })
)(props => {
    const {
        inited,
        refetch,
        loading,
        dispatchLoading,
        dispatchResponse,
        dispatchError,
        shopId,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (loading || (inited && !refetch)) return

        dispatchLoading()

        client.query({
            query: gql`
                query user_shop($id: Uuid!) {
                    user {
                        me {
                            shops(id: $id) {
                                shop {
                                    id
                                    name
                                }
                                memberAuthority
                                orderAuthority
                                productAuthority
                            }
                        }
                    }
                }
            `,
            fetchPolicy: 'network-only',
            variables: {
                id: shopId,
            }
        })
        .then(res => {
            const data = res.data.user.me.shops[0]
            if (!data) throw new Error('Shop not found.')
            dispatchResponse({
                id: data.shop.id,
                name: data.shop.name,
                memberAuthority: data.memberAuthority,
                orderAuthority: data.orderAuthority,
                productAuthority: data.productAuthority,
            })
        })
        .catch(err => {
            console.error(err)
            dispatchError()
        })
    })

    return null
})

const ProductsController = connect(
    state => ({
        inited: state.shopProducts.inited,
        refetch: state.shopProducts.refetch,
        loading: state.shopProducts.loading,
        variables: state.shopProducts.variables,
    }),
    dispatch => ({
        dispatchLoading: () => dispatch(shopProductsActions.loading()),
        dispatchResponse: (data) => dispatch(shopProductsActions.response(data)),
        dispatchError: () => dispatch(shopProductsActions.error())
    })
)(props => {
    const {
        inited,
        refetch,
        loading,
        variables,
        dispatchLoading,
        dispatchResponse,
        dispatchError,
        shopId,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if ( loading || (inited && !refetch)) return

        dispatchLoading()

        client.query({
            query: gql`
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
            fetchPolicy: 'network-only',
            variables: {
                ...variables,
                shopId: shopId,
            }
        })
        .then(res => dispatchResponse({ products: res.data.shop.search[0].products }))
        .catch(err => {
            console.error(err)
            dispatchError()
        })
    })

    return null
})

const OrdersController = connect(
    state => ({
        inited: state.shopOrders.inited,
        refetch: state.shopOrders.refetch,
        loading: state.shopOrders.loading,
    }),
    dispatch => ({
        dispatchLoading: () => dispatch(shopOrdersActions.loading()),
        dispatchResponse: (data) => dispatch(shopOrdersActions.response(data)),
        dispatchError: () => dispatch(shopOrdersActions.error())
    })
)(props => {
    const {
        inited,
        refetch,
        loading,
        dispatchLoading,
        dispatchResponse,
        dispatchError,
        shopId,
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if ( loading || (inited && !refetch)) return

        dispatchLoading()

        client.query({
            query: gql`
                query shop_orders($id: Uuid!) {
                    user {
                        me {
                            shops(id: $id) {
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
            fetchPolicy: 'network-only',
            variables: {
                id: shopId,
            }
        })
        .then(res => {
            let orders = res.data.user.me.shops[0].orders
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

            dispatchResponse({ orders: orders })
        })
        .catch(err => {
            console.error(err)
            dispatchError()
        })
    })

    return null
})

export default ShopPage