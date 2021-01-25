import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
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

const AppBar = connect(
    state => ({
        userSignedIn: state.userInfo.signedIn,
    })
)(props => {
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

const Logo = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    return (
        <div
            className={clsx('Logo', deviceType)}
            onClick={() => location.href = `${location.origin}/#/`}
        >
            <Icon />
        </div>
    )
})

export default AppBar