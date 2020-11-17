import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import {
    connectDeviceInfoType,
    connectUserInfoSignedIn,
} from '../store'
import TopBar from '../TopBar'
import Icon from '../Icon'
import SignInUp from './SignInUp'
import User from './User'

const AppBarRoot = styled(TopBar.Root)`
    >.TopBar-content {
        >.Logo {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
    
            &.desktop {
                margin-left: 30px;
            }
    
            &.tablets, &.mobile {
                position: absolute;
                height: 100%;
                left: 50%;
                transform: translate(-50%, 0px);
            }
        }
    
        .Buttons {
            margin-left: auto;
        }
    }
`

const AppBar = connectUserInfoSignedIn(props => {
    const {
        userSignedIn,
    } = props

    return (
        <AppBarRoot>
            <Logo />
            <div className='Buttons'>
                {
                    userSignedIn ?
                    <User /> :
                    <SignInUp />
                }
            </div>
        </AppBarRoot>
    )
})

const Logo = connectDeviceInfoType(props => {
    const {
        deviceType,
    } = props

    return (
        <div
            className={clsx('Logo', deviceType)}
            onClick={() => location.href = `${location.origin}/`}
        >
            <Icon />
        </div>
    )
})

export default AppBar