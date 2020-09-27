import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { createQueryStore } from '../../utils/apollo'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import Terminal from '../../components/Terminal'
import TextInput from '../../components/utils/TextInput'
import RectButton from '../../components/utils/RectButton'
import Loading from '../../components/utils/Loading'
import Decorate from '../../components/utils/Decorate'
import { FloatItem } from '../../components/utils/FloatList'
import '../../styles/text.less'
import './index.less'

const {
    reducer,
    actions,
    Controller,
} = createQueryStore({
    name: 'myShops',
    queryStr: gql`
        query my_shops($shopId: Uuid, $shopName: String) {
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
    produceResponseData: data => ({
        shops: data.user.me.shops.map((e) => e.shop)
    })
})

export {
    reducer as myShopsReducer,
    actions as myShopsActions,
    Controller as MyShopsController,
}

const Shops = connect(
    state => ({
        variables: state.myShops.variables,
    }),
    dispatch => ({
        refetch: variables => dispatch(actions.refetchAction(variables)),
    }),
)(props => {
    const {
        variables,
        refetch,
    } = props

    const newProps = {
        Component: New
    }

    const searchProps = {
        defaultValue: variables.shopName,
        onCommit: value => refetch({ shopName: value }),
    }

    return (
        <Terminal
            className='Shops-root'
            newProps={newProps}
            searchProps={searchProps}
            BodyComponent={Body}
        />
    )
})

const Body = connect(
    state => ({
        loading: state.myShops.loading,
        error: state.myShops.error,
        shops: state.myShops.data.shops,
    })
)(props => {
    const {
        loading,
        error,
        shops = [],
    } = props

    let shopElements = null

    if (loading) {
        shopElements = <Loading/>
    } else if (error) {
        shopElements = null
    } else if (shops.length === 0) {
        shopElements = <Decorate.Blank>No data.</Decorate.Blank>
    } else {
        shopElements = shops.map((shop, i) => (
            <ShopEntry
                key={i}
                data={shop}
            />
        ))
    }

    return <Decorate.DevideList>{shopElements}</Decorate.DevideList>
})

const ShopEntry = props => {
    const {
        data,
    } = props

    return (
        <div className='ShopEntry-root'>
            <span
                className={clsx('Name', 'Text_header_2nd', 'Text_link')}
                onClick={() => location.href = `${location.origin}/shop?id=${data.id}`}
            >
                {data.name}
            </span>
            {data.description}
            <span className={clsx('LatestUpdate', 'Text_remark')}>
                {`Latest updated at ${(new Date(data.latestUpdate)).toLocaleString('en')}`}
            </span>
        </div>
    )
}

const New = connect(
    () => ({}),
    dispatch => ({
        refetchMyShops: () => dispatch(actions.refetchAction()),
    }),
)(props => {
    const {
        refetchMyShops,
    } = props

    const refName = useRef(null)
    const refFoldItem = useRef(null)

    const [busy, setBusy] = useState(false)
    const [inputError, setInputError] = useState('')
    const [hintError, setHintError] = useState('')
    const abort = useAbort()

    const handleCreate = (e) => {
        if (!busy) {
            setInputError('')
            setHintError('')
            let checked = true
            if (!refName.current.value) {
                setInputError('Please enter shop name.')
                checked = false
            }
            if (checked) {
                let abortTk = abort.signup()
                setBusy(true)
                axios({
                    method: 'POST',
                    url: '/api/shop',
                    data: {
                        shop_name: refName.current.value,
                    },
                    cancelToken: abortTk.axiosCancelTk(),
                })
                .then((res) => {
                    if (!abortTk.isAborted() && res.status === 200) {
                        refetchMyShops()
                        refFoldItem.current.startFold()
                    }
                })
                .catch((err) => {
                    if (!abortTk.isAborted()) {
                        switch (err.response.data.type) {
                            case 'ShopNameUsed':
                                setHintError('Shop name has been used.')
                                break
                            default:
                                setHintError('Encountered an unknown error, please try again.')
                        }
                    }
                    console.log(err.response)
                })
                .finally(() => {
                    if (!abortTk.isAborted()) {
                        abort.signout(abortTk)
                        setBusy(false)
                    }
                })
            }
        }
    }

    return (
        <div className='ShopNew-root'>
            Create a new shop.
            <TextInput
                ref={refName}
                label='Shop name'
                error={inputError ? true : false}
                helperText={inputError}
            />
            {hintError && <span className={clsx('Text_error')}>{hintError}</span>}
            <FloatItem
                ref={refFoldItem}
                manualFold
            >
                <RectButton
                    onClick={handleCreate}
                    loading={busy}
                >
                    Create    
                </RectButton>
            </FloatItem>
        </div>
    )
})

export default Shops