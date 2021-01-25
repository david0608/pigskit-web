import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { MdRefresh } from 'react-icons/md'
import { withClass } from './utils'
import { FloatList } from './FloatList'
import Button from './Button'
import SearchField from './SearchField'

const TerminalRoot = withClass(
    'Terminal-root',
    styled.div`
        >.Title {
            margin-bottom: 24px;
        }

        >.Control {
            margin: 0px 0px 16px 0px;

            &.desktop, &.tablets {
                height: 30px;
                display: flex;

                >.Search {
                    width: 40%;
                }

                >.Right {
                    margin-left: auto;
                }
            }

            &.mobile {
                >.Search, >.Right {
                    height: 30px;
                    width: 100%;
                }

                >.Search {
                    margin-bottom: 16px;
                }

                >.Right {
                    justify-content: flex-end;
                }
            }

            >.Right {
                display: flex;

                >.Control-item {
                    height: 100%;

                    &.New, .New {
                        color: white;
                        background-color: #00A320;
                    }

                    >.FoldList-Label {
                        height: 100%;

                        button {
                            height: 100%;
                        }
                    }

                    >.FoldList-List {
                        padding: 10px 15px;
                    }

                    &.Refresh {
                        cursor: pointer;
                        height: 30px;
                        width: 30px;
                        border-radius: 15px;
                        font-size: 24px;
                        color: #777777;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 12px;

                        &:hover {
                            background-color: #ececec;
                        }
                    }
                }
            }

            .MuiInputBase-root {
                border-radius: 5px;
            }
        }
    `
)

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
        <TerminalRoot className={className}>
            {title && <div className={clsx('Title', 'Text_header_1st')}>{title}</div>}
            <Control
                newProps={newProps}
                searchProps={searchProps}
                refreshProps={refreshProps}
            />
            <BodyComponent {...bodyProps}/>
        </TerminalRoot>
    )
}

export default Terminal

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