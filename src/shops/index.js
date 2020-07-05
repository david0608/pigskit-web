import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import clsx from 'clsx';
import { pigskit_graphql_origin } from '../utils/service_origins';
import { StoreProvider, deviceInfoReducer, userInfoReducer } from '../components/store';
import Measurer from '../components/Measurer';
import Session from '../components/Session';
import NavBar from '../components/NavBar';
import ShopsBody from './ShopsBody';
import UserProfile from './UserProfile';
import './index.less';

const graphqlClient = new ApolloClient({
    uri: `${pigskit_graphql_origin()}/graphql`,
    credentials: 'include'
})

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
                    <div className={clsx('Shops-Root', deviceType)}>
                        <UserProfile className='UserInfo'/>
                        <ShopsBody className='ShopsBody'/>
                    </div>
                    <div className='test'></div>
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
    <ApolloProvider client={graphqlClient}>
        <StoreProvider
            reducers={{
                deviceInfo: deviceInfoReducer,
                userInfo: userInfoReducer,
            }}
        >
            <App/>
        </StoreProvider>
    </ApolloProvider>,
    document.getElementById('root')
);