import React, { useState, useRef } from 'react'
import { gql } from 'apollo-boost'
import { QueryProvider, queryComponent, useQueryContext } from '../../utils/apollo'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import Terminal from '../../components/Terminal'
import TextInput from '../../components/utils/TextInput'
import Button from '../../components/utils/Button'
import Loading from '../../components/utils/Loading'
import Case from '../../components/utils/Case'
import { FloatItem } from '../../components/utils/FloatList'
import './index.less'

const Shops = React.memo(() => {
    return <QueryProvider>
        <Terminal
            className='Shops'
            title='Your shops'
            NewComponent={New}
            QueryComponent={Query}
            BodyComponent={Body}
        />
    </QueryProvider>
})

const Query = queryComponent({
    queryStr: gql`
        query my_shops($id: Uuid, $name: String) {
            shop {
                my(id: $id, name: $name) {
                    id
                    name
                    latestUpdate
                }
            }
        }
    `,
    paramDispatcher: (params) => ({
        name: params.searchValue,
    }),
    resReducer: (data) => (data.shop.my)
})

const Body = () => {
    const queryContext = useQueryContext()

    if (!queryContext) return null

    let children = null

    if (queryContext.loading) {
        children = <Loading/>
    } else {
        if (queryContext.error) {
            console.log('Query error:', queryContext.error)
        } else {
            let data = queryContext.data()
            if (data && data.length > 0) {
                children = data.map((e, i) => (
                    <ShopEntry
                        key={i}
                        shopId={e.id}
                        shopName={e.name}
                        description={e.description}
                        latestUpdate={e.latestUpdate}
                    />
                ))
            } else {
                children = <Case.Blank>No data.</Case.Blank>
            }
        }
    }

    return <Case.DevideList>{children}</Case.DevideList>
}

const ShopEntry = (props) => {
    const {
        shopId,
        shopName,
        description,
        latestUpdate,
    } = props

    const onClick = () => {
        location.href = `${location.origin}/shop?id=${shopId}`
    }
    
    return (
        <div className='ShopEntry-Root'>
            <span
                className='Name'
                onClick={onClick}
            >
                {shopName}
            </span>
            <span>{description}</span>
            <span className='LatestUpdate'>{`Latest updated at ${(new Date(latestUpdate)).toLocaleString('en')}`}</span>
        </div>
    )
}

const New = (props) => {
    const {
        onComplete = () => {},
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
                        onComplete()
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
        <div className='ShopNew-Root'>
            <span className='Desc'>Create a new shop.</span>
            <TextInput
                ref={refName}
                label='Shop name'
                error={inputError ? true : false}
                helperText={inputError}
            />
            {hintError ? <p className='HintError'>{hintError}</p> : null}
            <FloatItem
                ref={refFoldItem}
                manualFold
            >
                <Button
                    onClick={handleCreate}
                >
                    Create    
                </Button>
            </FloatItem>
        </div>
    )
}

export default Shops