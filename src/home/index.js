import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider, deviceInfoReducer } from '../components/store';
import Measurer from '../components/Measurer';
import NavBar from '../components/NavBar';
import './index.less';


const App = () => {
    return (<>
        <Measurer />
        <NavBar />
        <div className='test'/>
    </>)
}

ReactDOM.render(
    <StoreProvider
        reducers={{
            deviceInfo: deviceInfoReducer
        }}
    >
        <App/>
    </StoreProvider>,
    document.getElementById('root')
);