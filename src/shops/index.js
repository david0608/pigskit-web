import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { StoreProvider, deviceInfoReducer, userInfoReducer } from '../components/store';
import Measurer from '../components/Measurer';
import Session from '../components/Session';
import NavBar from '../components/NavBar';
import ShopsBody from './ShopsBody';
import './index.less';

const mapStateToProps = (state) => ({
    deviceType: state.deviceInfo.type,
    userInfoInited: state.userInfo.inited,
    userSignedIn: state.userInfo.signedIn,
})

const App = connect(
    mapStateToProps
)((props) => {
    const {
        deviceType,
        userInfoInited,
        userSignedIn,
    } = props;

    if (userInfoInited) {
        if (userSignedIn) {
            return (<>
                <Measurer/>
                {deviceType === 'unknown' ? null : <>
                    <NavBar/>
                    <div className='Shops-Root'>
                        <div className='Shops-UserInfo'>
                            <span className='Title'>Your shops</span>
                        </div>
                        <ShopsBody className='Shops-Body'/>
                    </div>
                </>}
            </>)
        } else {
            location.href = `${location.origin}/home`
            return null
        }
    } else {
        return <Session/>
    }
})

ReactDOM.render(
    <StoreProvider
        reducers={{
            deviceInfo: deviceInfoReducer,
            userInfo: userInfoReducer,
        }}
    >
        <App/>
    </StoreProvider>,
    document.getElementById('root')
);