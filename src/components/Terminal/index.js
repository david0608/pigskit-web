import React, { useRef, useReducer, useEffect } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { FloatList } from '../utils/FloatList'
import Button from '../utils/Button'
import SearchField from '../utils/SearchField'
import LoadingRing from '../../components/utils/Loading'
import { useQeuryContext } from '../../utils/apollo'
import './index.less'

const INIT_STATE = {
    inited: false,
    searchValue: '',
}

function reducer(state, action) {
    state.inited = true
    switch (action.type) {
        case 'SEARCH_COMMIT':
            return {
                ...state,
                searchValue: action.payload
            }
        case 'REFRESH':
            return {
                ...state
            }
        default:
            return state
    }
}

const Terminal = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        className,
        label,
        NewComponent = () => { return null },
        QueryComponent = () => { return null },
        DisplayComponent = () => { return null },
    } = props

    const [state, dispatch] = useReducer(reducer, INIT_STATE)

    const refQuery = useRef(null)

    const refresh = () => {
        refQuery.current?.refetch(state)
    }

    useEffect(
        () => {
            if (!state.inited) return
            refresh()
        },
        [state]
    )

    return (
        <div className={clsx('Terminal-Root', className)}>
            <Label>{label}</Label>
            <Control
                deviceType={deviceType}
                dispatch={dispatch}
                NewComponent={NewComponent}
            />
            <Devider/>
            <QueryComponent ref={refQuery}>
                <Body DisplayComponent={DisplayComponent}/>
            </QueryComponent>
        </div>
    )
})

const Label = (props) => {
    return props.children ?
        <div
            className='Label-Root'
            children={props.children}
        />
        : null
}

const Control = (props) => {
    const {
        deviceType,
        dispatch,
        NewComponent,
    } = props

    return (
        <div className={clsx('Control-Root', deviceType)}>
            <SearchField
                onCommit={(value) => dispatch({ type: 'SEARCH_COMMIT', payload: value })}
            />
            <div className='BodyRight'>
                <ControlFloatList
                    className='New'
                    deviceType={deviceType}
                    label={<Button><GoPlus/>New</Button>}
                >
                    <NewComponent
                        onComplete={() => dispatch({ type: 'REFRESH' })}
                    />
                </ControlFloatList>
            </div>
        </div>
    )
}

const ControlFloatList = (props) => {
    const {
        className,
        deviceType,
        label,
        children,
    } = props

    return children ?
        <FloatList
            className={className}
            label={label}
            rightAligned
            fullScreen={deviceType === 'mobile'}
        >
            {children}
        </FloatList>
        : null
}

const Body = (props) => {
    const {
        DisplayComponent,
    } = props

    const queryContext = useQeuryContext()

    if (!queryContext) return null

    if (queryContext.loading) {
        return <Loading/>
    } else {
        if (queryContext.error) {
            console.log('query error:', queryContext.error)
            return null
        } else {
            let data = queryContext.data()
            if (data && data.length > 0) {
                return <DisplayComponent data={data}/>
            } else {
                return <NotFound/>
            }
        }
    }
}

const Loading = () => {
    return (<>
        <div className='Loading'>
            <LoadingRing
                radius={16}
                strokeWidth={4}
                stroke='rgba(0, 0, 0, 0.4)'
            />
        </div>
        <Devider/>
    </>)
}

const NotFound = () => {
    return (<>
        <div className='NotFound'>Not found.</div>
        <Devider/>
    </>)
}

const Devider = () => {
    return <div className='Devider'></div>
}

export default Terminal