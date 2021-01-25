import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { Client as GraphqlClient } from '../../utils/apollo'
import { actions as userShopsActions } from '../../store/user_shops'
import Navigator from '../../components/Navigator'
import Avatar from '../../components/Avatar'
import Path from '../../components/Path'
import Page from '../../components/Page'
import Shops from './Shops'
import Profile from './Profile'

const HomePage = connect(
    state => ({
        userSignedIn: state.userInfo.signedIn,
    })
)(props => {
    const {
        userSignedIn,
    } = props

    if (!userSignedIn) return <Redirect to='/'/>

    return (<>
        <Controller/>
        <Page.Root>
            <AvatarBlock/>
            <BodyBlock/>
        </Page.Root>
    </>)
})

const Controller = connect(
    state => ({
        inited: state.userShops.inited,
        refetch: state.userShops.refetch,
        loading: state.userShops.loading,
        variables: state.userShops.variables,
    }),
    dispatch => ({
        dispatchLoading: () => dispatch(userShopsActions.loading()),
        dispatchResponse: (data) => dispatch(userShopsActions.response(data)),
        dispatchError: () => dispatch(userShopsActions.error()),
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
    } = props

    const client = useMemo(() => new GraphqlClient(), [])

    useEffect(() => {
        if (loading || (inited && !refetch)) return

        dispatchLoading()

        client.query({
            query: gql`
                query user_shops($shopId: Uuid, $shopName: String) {
                    user {
                        me {
                            shops(id: $shopId, name: $shopName) {
                                shop {
                                    id
                                    name
                                    latestUpdate
                                }
                            }
                        }
                    }
                }
            `,
            fetchPolicy: 'network-only',
            variables: { ...variables },
        })
        .then(res => dispatchResponse({ shops: res.data.user.me.shops.map(e => e.shop)}))
        .catch(err => {
            console.error(err)
            dispatchError()
        })
    })

    return null
})

const AvatarBlockRoot = styled(Page.Block)`
    display: flex;
    align-items: center;

    >.Avatar-root {
        width: 100px;
        margin-right: 32px;
    }
`

const AvatarBlock = () => (
    <AvatarBlockRoot>
        <Avatar/>
        <Path/>
    </AvatarBlockRoot>
)

const BodyBlock = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    if (deviceType === 'desktop') {
        return (
            <Page.Block>
                <Page.SideBar>
                    <HomeNavigator/>
                </Page.SideBar>
                <Page.Content>
                    <SwitchContent/>
                </Page.Content>
            </Page.Block>
        )
    } else {
        return (
            <>
                <HomeNavigator/>
                <Page.Block>
                    <SwitchContent/>
                </Page.Block>
            </>
        )
    }
})

const HomeNavigator = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    const matchPath = useRouteMatch().path

    return (
        <Navigator
            vertical={deviceType === 'desktop'}
            links={[
                {
                    name: 'shops',
                    to: `${matchPath}/`,
                },
                {
                    name: 'profile',
                    to: `${matchPath}/profile`,
                }
            ]}
        />
    )
})

const SwitchContent = props => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/profile`}>
                <Profile/>
            </Route>
            <Route path={`${match.path}/`}>
                <Shops/>
            </Route>
        </Switch>
    )
}

export default HomePage