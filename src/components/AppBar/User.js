import React, { useState } from 'react'
import styled from 'styled-components'
import { FiLogOut } from "react-icons/fi"
import {
    connectDeviceInfoType,
    connectUserInfoUsernameNickname,
} from '../store'
import axios from '../../utils/axios'
import TopBar from '../TopBar'
import { FloatItem } from '../utils/FloatList'
import RectButton from '../utils/RectButton'
import Devider from '../Devider'
import { pigskit_restful_origin } from '../../utils/service_origins'

const UserRoot = styled(TopBar.FloatList)`
    >.FoldList-List {
        width: 200px;
        display: block;

        >p {
            margin: 8px 16px;
        }

        >.FloatItem-Root {
            width: inherit;

            >.MuiButton-root {
                width: inherit;
                height: 30px;
                padding: 0px 16px;
                transition: unset;

                >.MuiButton-label {
                    justify-content: unset;
                    text-transform: none;
                    color: #333333;
                }

                &:hover .MuiButton-label {
                    color: white;
                }
            }
        }
    }
`

const User = connectDeviceInfoType(
    connectUserInfoUsernameNickname(
        props => {
            const {
                deviceType,
                username,
                nickname,
            } = props

            return (
                <UserRoot
                    label={
                        <TopBar.Button
                            deviceType={deviceType}
                        >
                            <img src={`${pigskit_restful_origin()}/api/user/profile/avatar?default=true`}/>
                        </TopBar.Button>
                    }
                    rightAligned
                >
                    <p>Hello,&nbsp;<strong>{nickname || username}</strong></p>
                    <Devider.Light/>
                    <FloatItem>
                        <LinkButton url={`${location.origin}/home#/`}>Your shops</LinkButton>
                    </FloatItem>
                    <FloatItem>
                        <LinkButton url={`${location.origin}/home#/profile`}>Your profile</LinkButton>
                    </FloatItem>
                    <FloatItem>
                        <SignOutButton/>
                    </FloatItem>
                </UserRoot>
            )
        }
    )
)

const LinkButton = props => {
    const {
        url,
        ...otherProps
    } = props

    return (
        <RectButton
            onClick={() => location.href = url}
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