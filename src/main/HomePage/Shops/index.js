import React from 'react'
import { connect } from 'react-redux'
import { actions as userShopsActions } from '../../../store/user_shops'
import Terminal from '../../../components/Terminal'
import { Loading } from '../../../components/Loading'
import Decorate from '../../../components/Decorate'
import New from './New'
import Entry from './Entry'

const Shops = connect(
    state => ({
        variables: state.userShops.variables,
    }),
    dispatch => ({
        refetch: variables => dispatch(userShopsActions.refetch(variables)),
    }),
)(props => {
    const {
        variables,
        refetch,
    } = props

    return (
        <Terminal
            newProps={{
                Component: New,
            }}
            searchProps={{
                defaultValue: variables.shopName,
                onCommit: value => refetch({ shopName: value }),
            }}
            BodyComponent={Body}
        />
    )
})

export default Shops

const Body = connect(
    state => ({
        loading: state.userShops.loading,
        error: state.userShops.error,
        shops: state.userShops.shops,
    })
)(props => {
    const {
        loading,
        error,
        shops = [],
    } = props

    let children = null
    if (loading) {
        children = <Loading/>
    } else if (error) {
        children = null
    } else if (shops.length === 0) {
        children = <Decorate.Blank>No data.</Decorate.Blank>
    } else {
        children = shops.map((shop, i) => (
            <Entry
                key={i}
                data={shop}
            />
        ))
    }

    return <Decorate.DevideList>{children}</Decorate.DevideList>
})