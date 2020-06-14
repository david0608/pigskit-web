import React, { useState } from 'react';
import clsx from 'clsx';
import './DropDown.less';

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

export default DropDown;