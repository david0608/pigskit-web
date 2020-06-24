import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FiLogOut } from "react-icons/fi";
import NavBarDropDownList from './utils/NavBarDropDownList';
import NavButton from './utils/NavButton';
import RectButton from '../utils/RectButton';

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
            <NavBarDropDownList className={className} rightAlign>
                <NavButton deviceType={deviceType}>
                    <img src={`${location.origin}/fs/user/avatar`}/>
                </NavButton>
                <p className='Title'>Hello, <strong>{nickname || username}</strong></p>
                <div className='Devider'></div>
                <dropdown-item>
                    <LinkButton url={`${location.origin}/shops`}>Your shops</LinkButton>
                </dropdown-item>
                <dropdown-item>
                    <SignOutButton/>
                </dropdown-item>
            </NavBarDropDownList>
        )
    }
))

const LinkButton = (props) => {
    const {
        url,
        ...otherProps
    } = props;

    const handleClick = () => {
        location.href = url;
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
    const [busy, setBusy] = useState(false);

    const handleClick = () => {
        if (!busy) {
            setBusy(true)
            axios({
                method: 'DELETE',
                url: `${location.origin}/api/user/session`,
            })
            .then((res) => {
                if (res.status === 200) {
                    location.href = `${location.origin}/home`
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

export default NavBarUser;