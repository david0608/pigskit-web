import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { TopBar } from '../utils/Decorate/TopBar'
import Icon from '../utils/Icon'
import SignInUp from './SignInUp'
import User from './User'
import './index.less'

const AppBar = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
        userSignedIn: state.userInfo.signedIn,
    })
)((props) => {
    const {
        deviceType,
        userSignedIn,
    } = props

    return (
        <TopBar className='AppBar-root'>
            <Logo deviceType={deviceType}/>
            <div className='Buttons'>
                {
                    userSignedIn ?
                    <User deviceType={deviceType}/> :
                    <SignInUp deviceType={deviceType}/>
                }
            </div>
        </TopBar>
    )
})

const Logo = (props) => {
    const {
        deviceType,
    } = props

    return (
        <div
            className={clsx('Logo', deviceType)}
            onClick={() => location.href = `${location.origin}/`}
        >
            <Icon/>
        </div>
    )
}

export default AppBar