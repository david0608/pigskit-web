import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import NavButton from '../components/NavBar/utils/NavButton';
import './index.less';

const App = () => {
    return (<>
        <div className='NavBarRoot'>
            <DropDown>
                <NavButton>click</NavButton>
                <p style={{ width: '150px' }}>hello</p>
                <p>world</p>
                <p>123</p>
                <button>button</button>
            </DropDown>
            <DropDown className='RightAligned'>
                <NavButton>test</NavButton>
                <p style={{ width: '150px' }}>hello</p>
                <p>world</p>
                <p>123</p>
                <button>button</button>
            </DropDown>
        </div>
        <div className='test'/>
    </>)
}

const DropDown = (props) => {
    const {
        className,
        children,
    } = props;

    const [hidden, setHidden] = useState(true)

    let elements = React.Children.toArray(children);

    let button = elements[0];
    if (button) {
        button = React.cloneElement(
            button,
            {
                onClick: () => setHidden(false),
            }
        )
    }

    return (<>
        <div className={clsx('DropDownRoot',hidden && 'Hidden', className)}>
            {button}
            <div className={clsx('DropDownList', hidden && 'Hidden')}>
                {elements.slice(1)}
            </div>
        </div>
        {
            hidden ? null
            : <div className='DropDownShield' onClick={() => setHidden(true)}/>
        }
    </>)
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);