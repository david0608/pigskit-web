import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { MdRefresh } from 'react-icons/md'
import { FloatList } from '../utils/FloatList'
import Button from '../utils/Button'
import SearchField from '../utils/SearchField'
import '../../styles/text.less'
import './index.less'

const Terminal = props => {
    const {
        className,
        title,
        newProps,
        searchProps,
        refreshProps,
        BodyComponent = () => null,
        bodyProps = {},
    } = props

    return (
        <div className={clsx('Terminal-root', className)}>
            {title && <div className={clsx('Title', 'Text_header_1st')}>{title}</div>}
            <Control
                newProps={newProps}
                searchProps={searchProps}
                refreshProps={refreshProps}
            />
            <BodyComponent {...bodyProps}/>
        </div>
    )
}

const Control = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
        newProps,
        searchProps,
        refreshProps,
    } = props

    return (
        <div className={clsx('Control', deviceType)}>
            {
                searchProps &&
                <SearchField
                    className='Search'
                    defaultValue={searchProps.defaultValue}
                    onCommit={searchProps.onCommit}
                />
            }
            <div className='Right'>
                {
                    newProps &&
                    <ControlItem
                        className='New'
                        deviceType={deviceType}
                        url={newProps.url}
                        Component={newProps.Component}
                    >
                        <GoPlus/>&nbsp;New
                    </ControlItem>
                }
                {
                    refreshProps &&
                    <ControlRefresh
                        onClick={refreshProps.onClick}
                    />
                }
            </div>
        </div>
    )
})

const ControlItem = props => {
    const {
        className,
        deviceType,
        url,
        Component,
        children,
    } = props

    if (url) {
        return (
            <Button
                className={clsx('Control-item', className)}
                onClick={() => location.href = url}
            >
                {children}
            </Button>
        )
    } else if (Component) {
        return (
            <FloatList
                className='Control-item'
                label={<Button className={className}>{children}</Button>}
                fullScreen={deviceType === 'mobile'}
                rightAligned
            >
                <Component/>
            </FloatList>
        )
    } else {
        return null
    }
}

const ControlRefresh = props => {
    const {
        onClick,
    } = props

    return (
        <div
            className={clsx('Control-item', 'Refresh')}
            onClick={onClick}
        >
            <MdRefresh/>
        </div>
    )
}

export default Terminal