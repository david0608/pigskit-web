import React, { useRef } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import PopScreen from '../PopScreen';
import LoginButton from './NavBarLogin';
import './index.less';

const mapStateToProps = (state) => ({
    deviceType: state.deviceInfo.type,
    deviceScrolled: state.deviceInfo.scrolled,
})

const NavBar = connect(
    mapStateToProps
)((props) => {
    const {
        deviceType,
        deviceScrolled,
        logo = true,
        login = true,
    } = props;

    const refPopScreen = useRef(null);

    return (<>
        <PopScreen ref={refPopScreen} className='NavBarPopScreen'/>
        <div className={clsx('NavBarRoot', deviceScrolled && 'Scrolled')}>
            {logo ? <NavBarLogo className={`Logo_${deviceType}`}/> : null}
            {login ? <LoginButton className={`LoginButton_${deviceType}`} deviceType={deviceType} popScreenRef={refPopScreen}/> : null}
        </div>
        <div className='NavBarSpace'/>
    </>)
})

const NavBarLogo = React.memo(
    (props) => {
        const { className } = props;

        return (
            <div
                className={clsx('NavBarLogoRoot', className)}
                onClick={() => location.href = `${location.origin}/home`}
            >
                <span>Pigskit</span>
            </div>
        )
    }
)

export default NavBar;