import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import NavBarSignInUp from './NavBarSignInUp';
import NavBarUser from './NavBarUser';
import './index.less';

const mapStateToProps = (state) => ({
    state: {
        deviceType: state.deviceInfo.type,
        deviceScrolled: state.deviceInfo.scrolled,
        userSignedIn: state.userInfo.signedIn,
    }
})

const NavBar = connect(
    mapStateToProps
)((props) => {
    const {
        state
    } = props;

    const {
        deviceType,
        deviceScrolled,
        userSignedIn,
    } = state;

    return (<>
        <div className={clsx('NavBar-Root', deviceScrolled && 'Scrolled')}>
            <div className='NavBar-Body'>
                <NavBarLogo deviceType={deviceType}/>
                <div className='NavButtons-Root'>
                    {
                        userSignedIn
                        ? <NavBarUser deviceType={deviceType}/>
                        : <NavBarSignInUp deviceType={deviceType}/>
                    }
                </div>
            </div>
        </div>
        <div className='NavBar-Space'/>
    </>)
})

const NavBarLogo = React.memo(
    (props) => {
        const {
            deviceType,
        } = props

        return (
            <div
                className={clsx('NavLogo-Root', deviceType && `NavLogo-${deviceType}`)}
                onClick={() => location.href = `${location.origin}/home`}
            >
                <span>Pigskit</span>
            </div>
        )
    }
)

export default NavBar;