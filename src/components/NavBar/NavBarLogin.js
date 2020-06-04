import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import NavButton from './NavButton';
import RectButton from '../utils/RectButton';
import TextInput from '../utils/TextInput';
import './NavBarLogin.less';

const LoginButton = React.memo(
    (props) => {
        const {
            className,
            popScreenRef,
            deviceType,
        } = props;

        const handleClick = () => {
            popScreenRef.current.open(() => <LogInPage/>)
        }
        
        return (
            <NavButton
                className={className}
                deviceType={deviceType}
                onClick={handleClick}
            >
                <BsFillPersonFill/>{deviceType === 'mobile' ? null : 'Login'}
            </NavButton>
        )
    }
)

const LogInPage = () => {
    return (<>
        <p className='Title'>Login</p>
        <TextInput label='User Name'/>
        <RectButton>Login</RectButton>
        <p>Haven't registered?</p>
    </>)
}

export default LoginButton;