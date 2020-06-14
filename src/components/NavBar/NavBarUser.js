import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import clsx from 'clsx';
import DropDown from '../utils/DropDown';
import NavButton from './NavButton';
import RectButton from '../utils/RectButton';
import './NavBarUser.less';

const NavBarUser = React.memo(
    (props) => {
        const {
            className,
            deviceType,
        } = props;

        return (
            <DropDown className={clsx('RightAligned', 'NavBarUserRoot', className)}>
                <NavButton
                    deviceType={deviceType}
                >
                    <img src={`${location.origin}/fs/user/avatar`}/>
                </NavButton>
                <UserPage/>
            </DropDown>
        )
    }
)

const mapStateToProps = (state) => ({
    state: {
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    }
})

const UserPage = connect(
    mapStateToProps
)((props) => {
    const {
        state,
    } = props;

    const {
        username,
        nickname,
    } = state;

    return (
        <div className='UserPageRoot'>
            <p className='Title'>Hello, <strong>{nickname || username}</strong></p>
            <div className='Devider'></div>
            <SignOutButton/>
        </div>
    )
})

const SignOutButton = () => {
    const [busy, setBusy] = useState(false);

    const handleLogOut = () => {
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
            className='LogOutButton'
            backgroundColor='white'
            onClick={handleLogOut}
        >
            Sign out
        </RectButton>
    )
}

export default NavBarUser;