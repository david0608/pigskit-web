import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FiLogOut } from 'react-icons/fi'
import { actions as userInfoActions } from '../../store/user_info'
import { actions as userShopsActions } from '../../store/user_shops'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import TopBar from '../TopBar'
import { FloatItem } from '../FloatList'
import RectButton from '../RectButton'
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

const User = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    })
)(props => {
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
                <LinkButton url={`${location.origin}/#/home`}>Your shops</LinkButton>
            </FloatItem>
            <FloatItem>
                <LinkButton url={`${location.origin}/#/home/profile`}>Your profile</LinkButton>
            </FloatItem>
            <FloatItem manualFold>
                <SignOutButton/>
            </FloatItem>
        </UserRoot>
    )
})

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

const SignOutButton = connect(
    state => ({}),
    dispatch => ({
        signOut: () => {
            dispatch(userInfoActions.refetch())
            dispatch(userShopsActions.reset())
        }
    })
)(props => {
    const {
        signOut,
    } = props

    const [busy, setBusy] = useState(false)
    const abort = useAbort()

    const handleClick = () => {
        if (busy) return
        setBusy(true)

        const abortTk = abort.signup()
        axios({
            method: 'DELETE',
            url: '/api/user/session',
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            signOut()
            location.href = `${location.origin}/#/`
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setBusy(false)
            }
        })
    }

    return (
        <RectButton
            onClick={handleClick}
            backgroundColor='white'
        >
            <FiLogOut/>&nbsp;Sign out
        </RectButton>
    )
})

export default User