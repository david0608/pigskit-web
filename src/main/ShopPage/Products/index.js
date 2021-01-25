import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { actions as shopProductsActions} from '../../../store/shop_products'
import Terminal from '../../../components/Terminal'
import Decorate from '../../../components/Decorate'
import { Loading } from '../../../components/Loading'
import Entry from './Entry'

const Products = connect(
    state => ({
        variables: state.shopProducts.variables,
        shopId: state.userShopInfo.id,
        productAuthority: state.userShopInfo.productAuthority,
    }),
    dispatch => ({
        refetch: variables => dispatch(shopProductsActions.refetch(variables))
    })
)(props => {
    const {
        variables,
        shopId,
        productAuthority,
        refetch,
    } = props

    const newProps = productAuthority === 'ALL' ?
        { url: `${location.origin}/#/shop/${shopId}/create_product` } :
        undefined

    const searchProps = {
        defaultValue: variables.productName,
        onCommit: value => refetch({ productName: value })
    }

    return (
        <Terminal
            newProps={newProps}
            searchProps={searchProps}
            BodyComponent={Body}
        />
    )
})

const BodyRoot = styled(Decorate.List)`
    margin: 16px 0px 16px 0px;

    >.Blank {
        background-color: #f9f9f9;
    }
`

const Body = connect(
    state => ({
        loading: state.shopProducts.loading,
        error: state.shopProducts.error,
        products: state.shopProducts.products,
    })
)(props => {
    const {
        loading,
        error,
        products = [],
    } = props

    let productElements = null

    if (loading) {
        productElements = <Loading/>
    } else if (error) {
        productElements = null
    } else if (products.length === 0) {
        productElements = <Decorate.Blank className='Blank'>No data.</Decorate.Blank>
    } else {
        productElements = products.map((prod, i) => (
            <Entry
                key={i}
                data={prod}
            />
        ))
    }

    return <BodyRoot>{productElements}</BodyRoot>
})

export default Products