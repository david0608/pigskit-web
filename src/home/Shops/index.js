import React, { useState, useRef } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import clsx from 'clsx'
import { queryComponent } from '../../utils/apollo'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import { pigskit_graphql_origin } from '../../utils/service_origins'
import Terminal from '../../components/Terminal'
import TextInput from '../../components/utils/TextInput'
import Button from '../../components/utils/Button'
import { FloatItem } from '../../components/utils/FloatList'
import Avatar from '../../components/Avatar'
import './index.less'

const graphqlClient = new ApolloClient({
    uri: `${pigskit_graphql_origin()}/graphql`,
    credentials: 'include',
})

const Shops = (props) => {
    const {
        deviceType,
    } = props

    return (
        <ApolloProvider client={graphqlClient}>
            <div className={clsx('Shops-Root', deviceType)}>
                <Avatar className='UserInfo'/>
                <Terminal
                    className='Body'
                    label='Your shops'
                    NewComponent={New}
                    QueryComponent={Query}
                    DisplayComponent={Display}
                />
            </div>
        </ApolloProvider>
    )
}

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
    queryDispatcher: (params) => ({
        name: params.searchValue,
    }),
    queryReducer: (data) => (data.shop.my)
})

const Display = (props) => {
    const {
        data,
    } = props

    return (
        <div className='ShopsDisplay'>
            {data.map((e) => {
                return <ShopEntry
                    key={e.id}
                    shopId={e.id}
                    shopName={e.name}
                    desc={e.desc}
                    latestUpdate={e.latestUpdate}
                />
            })}
        </div>
    )
}

const ShopEntry = (props) => {
    const {
        shopId,
        shopName,
        desc,
        latestUpdate,
    } = props
    
    return (<>
        <div className='ShopEntry-Root'>
            <span className='Name'>{shopName}</span>
            <span>{desc}</span>
            <span className='LatestUpdate'>{`Latest updated at ${(new Date(latestUpdate)).toLocaleString('en')}`}</span>
        </div>
        <Devider/>
    </>)
}

const Devider = () => {
    return <div className='Devider'></div>
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
            <FloatItem ref={refFoldItem} manualFold>
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