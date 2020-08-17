import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FiLogOut } from "react-icons/fi"
import axios from '../../utils/axios'
import { NavBarFloatList, NavBarFloatItem } from './utils/NavBarFloatList'
import NavButton from './utils/NavButton'
import RectButton from '../utils/RectButton'
import { DeviderL } from '../utils/Devider'
import { pigskit_restful_origin } from '../../utils/service_origins'

const NavBarUser = connect(
    (state) => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    })
)(React.memo(
    (props) => {
        const {
            className,
            deviceType,
            username,
            nickname,
        } = props

        return (
            <NavBarFloatList
                label={
                    <NavButton deviceType={deviceType}>
                        <img src={`${pigskit_restful_origin()}/fs/user/avatar`}/>
                    </NavButton>
                }
            >
                <p className='Title'>Hello, <strong>{nickname || username}</strong></p>
                <DeviderL/>
                <NavBarFloatItem>
                    <LinkButton url={`${location.origin}/home/#/shops`}>Your shops</LinkButton>
                </NavBarFloatItem>
                <NavBarFloatItem>
                    <SignOutButton/>
                </NavBarFloatItem>
            </NavBarFloatList>
        )
    }
))

const LinkButton = (props) => {
    const {
        url,
        ...otherProps
    } = props

    const handleClick = () => {
        location.href = url
    }

    return (
        <RectButton
            onClick={handleClick}
            backgroundColor='white'
            {...otherProps}
        />
    )
}

const SignOutButton = () => {
    const [busy, setBusy] = useState(false)

    const handleClick = () => {
        if (!busy) {
            setBusy(true)
            axios({
                method: 'DELETE',
                url: '/api/user/session',
            })
            .then((res) => {
                if (res.status === 200) {
                    location.href = `${location.origin}/`
                }
            })
            .finally(() => setBusy(false))
        }
    }

    return (
        <RectButton
            onClick={handleClick}
            backgroundColor='white'
        >
            <FiLogOut/>Sign out
        </RectButton>
    )
}

export default NavBarUser