import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PopScreen from '../components/PopScreen';
import './index.less';
import { StoreProvider, deviceInfoReducer, deviceInfoActions } from '../components/store';
import Measurer from '../components/Measurer';

import { connect } from 'react-redux';



const testInitState = {
    test: false
}

function testReducer(state = testInitState, action = {}) {
    switch (action.type) {
        case 'UPDATE_TEST':
            return Object.assign({}, state, { test: action.payload })
        default:
            return state;
    }
}

const App = () => {
    console.log('render App')
    return (
        <StoreProvider
            reducers={{
                deviceInfo: deviceInfoReducer,
                test: testReducer,
            }}
        >
            <_App/>
            <Test/>
        </StoreProvider>
    )
}

const _App = connect(
    (state) => ({
        type: state.deviceInfo.type,
    })
)((props) => {
    const { type } = props;
    const refPopScreen = useRef(null);
    console.log('render _App')
    return (<>
        <Measurer/>
        <PopScreen ref={refPopScreen} />
        <button onClick={() => refPopScreen.current.open(() => <Page/>)}>test</button>
        <p>{type}</p>
    </>)
})

const Test = connect(
    (state, ownProps) => ({
        ...ownProps,
        ...state.test,
    }),
    (dispatch) => ({
        updateTest: (test) => {
            dispatch({ type: 'UPDATE_TEST', payload: test })
        },
        updateScrolled: (scrolled) => {
            dispatch(deviceInfoActions.updateScrolled(scrolled))
        },
    })
)((props) => {
    const { test, updateTest, updateScrolled } = props
    console.log('render Test')
    return (<>
        <span>{test ? 'true' : 'false'}</span>
        <button onClick={() => updateScrolled(test)}>updatescrolled</button>
        <button onClick={() => updateTest(!test)}>updateTest</button>
    </>)
})

const Page = () => {
    return (
        <div className='page'>
            <div>hello</div>
            <div>world</div>
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);