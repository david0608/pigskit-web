import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.less';

import Transition from '../components/utils/Transition'

const ContentOne = React.memo(() => {
    console.log(1)
    return (
        <div className='ContentOne'>One</div>
    )
})
const ContentTwo = React.memo(() => {
    console.log(2)
    return (
        <div className='ContentTwo'>Two</div>
    )
})

const App = () => {
    const refTransition = useRef(null)

    return (
        <div className='TestRoot'>
            <button onClick={() => refTransition.current.renderContent(0)}>one</button>
            <button onClick={() => refTransition.current.renderContent(1)}>two</button>
            <Transition.Height
                ref={refTransition}
                timeout={300}
            >
                <ContentOne/>
                <ContentTwo/>
            </Transition.Height>
            <div>after</div>
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);