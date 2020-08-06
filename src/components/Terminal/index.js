import React, { useRef, useReducer, useEffect } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { FloatList } from '../utils/FloatList'
import Button from '../utils/Button'
import { DeviderL } from '../utils/Devider'
import SearchField from '../utils/SearchField'
import Blank from '../utils/Blank'
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

const Terminal = (props) => {
    const {
        className,
        label,
        newUrl,
        NewComponent,
        QueryComponent,
        DisplayComponent,
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
                terminalDispatch={dispatch}
                newUrl={newUrl}
                NewComponent={NewComponent}
            />
            <DeviderL/>
            {
                QueryComponent &&
                <QueryComponent ref={refQuery}>
                    <Body DisplayComponent={DisplayComponent}/>
                </QueryComponent>
            }
        </div>
    )
}

const Label = (props) => {
    return props.children ?
        <div
            className='Label-Root'
            children={props.children}
        />
        : null
}

const Control = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        terminalDispatch,
        newUrl,
        NewComponent,
    } = props

    return (
        <div className={clsx('Control-Root', deviceType)}>
            <SearchField
                onCommit={(value) => terminalDispatch({ type: 'SEARCH_COMMIT', payload: value })}
            />
            <div className='Control-Right'>
                <ControlNew
                    terminalDispatch={terminalDispatch}
                    newUrl={newUrl}
                    NewComponent={NewComponent}
                />
            </div>
        </div>
    )
})

const ControlNew = (props) => {
    const {
        terminalDispatch,
        newUrl,
        NewComponent,
    } = props

    if (newUrl) {
        return (
            <ControlItem
                className='New'
                onClick={() => location.href = newUrl}
            >
                <GoPlus/>New
            </ControlItem>
        )
    } else if (NewComponent) {
        return (
            <ControlItem
                className='New'
                component={<NewComponent onComplete={() => terminalDispatch({ type: 'REFRESH' })}/>}
            >
                <GoPlus/>New
            </ControlItem>
        )
    } else {
        return null
    }
}

const ControlItem = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        className,
        onClick,
        component,
        children,
    } = props

    if (onClick) {
        return (
            <Button
                className={clsx('ControlItem', className)}
                onClick={onClick}
            >
                {children}
            </Button>
        )
    } else {
        return (
            <FloatList
                className={'ControlItem'}
                label={<Button className={className}>{children}</Button>}
                fullScreen={deviceType === 'mobile'}
                rightAligned
            >
                {component}
            </FloatList>
        )
    }
})

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
                return <>{
                    DisplayComponent &&
                    <DisplayComponent data={data}/>
                }</>
            } else {
                return <Blank>Not found.</Blank>
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
        <DeviderL/>
    </>)
}

export default Terminal