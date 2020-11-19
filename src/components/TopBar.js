import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Button as MuiButton } from '@material-ui/core'
import { connectDeviceInfoScrolled } from './store'
import { withClass } from './utils'
import { FloatList as UtilFloatList } from './FloatList'

const RootSpace = styled.div`
    height: 64px;
    width: 100%;

    &.TopBar-body {
        position: fixed;
        top: 0;
        background-color: #FFFFFF;
        transition: box-shadow .3s;
        z-index: 90;

        >.TopBar-content {
            height: inherit;
            display: flex;
            max-width: 1260px;
            margin: auto;
        }
    
        &.Scrolled {
            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
        }
    }
`

const RootBody = withClass('TopBar-body', RootSpace)

const Root = connectDeviceInfoScrolled(props => {
    const {
        className,
        deviceScrolled,
        children,
    } = props

    return (<>
        <RootBody className={clsx(className, deviceScrolled && 'Scrolled')}>
            <div className='TopBar-content'>
                {children}
            </div>
        </RootBody>
        <RootSpace className={clsx(className)}/>
    </>)
})

const ButtonComponent = styled(MuiButton)`
    &.MuiButton-root {
        height: 100%;
        width: 100px;
        padding: unset;
        text-transform: unset;

        &::before {
            content: '';
            height: 50%;
            width: 1px;
            background: #d4d4d4;
        }

        >.MuiButton-label {
            font-size: 16px;
            font-family: Poppins, sans-serif;

            >svg {
                color: #FF3333;
                font-size: 20px;
            }

            >img {
                width: 34px;
                border-radius: 17px;
            }
        }

        &.mobile {
            width: 50px;

            &::before {
                content: unset;
            }

            >.MuiButton-label {
                font-size: 24px;
            }
        }
    }
`

const Button = props => {
    const {
        className,
        deviceType,
        ...otherProps
    } = props

    return (
        <ButtonComponent
            className={clsx(className, deviceType)}
            {...otherProps}
        />
    )
}

const FloatList = styled(UtilFloatList)`
    height: 100%;

    &.LeftAligned, &.RightAligned {
        &.Open {
            .FoldList-List {
                transform: unset;
            }

            &::after {
                transform: translate(-50%, 0px);
            }
        }
    }

    .FoldList-Label {
        height: inherit;

        .MuiButton-root {
            width: unset;
        }
    }
`

export default {
    Root,
    Button,
    FloatList,
}