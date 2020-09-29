import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FiLogOut } from "react-icons/fi"
import axios from '../../../utils/axios'
import { TopBarFloatList, TopBarButton } from '../../utils/Decorate/TopBar'
import { FloatItem } from '../../utils/FloatList'
import RectButton from '../../utils/RectButton'
import { DeviderL } from '../../utils/Devider'
import { pigskit_restful_origin } from '../../../utils/service_origins'
import './index.less'

const User = connect(
    (state) => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    })
)(React.memo(
    (props) => {
        const {
            deviceType,
            username,
            nickname,
        } = props

        return (
            <TopBarFloatList
                className='AppBarUser-root'
                label={
                    <TopBarButton deviceType={deviceType}>
                        <img src={`${pigskit_restful_origin()}/api/user/profile/avatar?default=true`}/>
                    </TopBarButton>
                }
            >
                <p>Hello,&nbsp;<strong>{nickname || username}</strong></p>
                <DeviderL/>
                <FloatItem>
                    <LinkButton url={`${location.origin}/home#/`}>Your shops</LinkButton>
                </FloatItem>
                <FloatItem>
                    <LinkButton url={`${location.origin}/home#/profile`}>Your profile</LinkButton>
                </FloatItem>
                <FloatItem>
                    <SignOutButton/>
                </FloatItem>
            </TopBarFloatList>
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
            <FiLogOut/>&nbsp;Sign out
        </RectButton>
    )
}

export default User