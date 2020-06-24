import React from 'react';
import clsx from 'clsx';
import '../../utils/dropdown';
import './DropDownList.less';

const DropDownList = (props) => {
    const {
        className,
        children,
    } = props

    let elements = React.Children.toArray(children)
    let label = elements.shift()
    if (!label) {
        label = <button>drop down button</button>
    }

    return (
        <dropdown-list class={clsx('DropDownList-Root', className)}>
            <dropdown-label class='DropDownList-Label'>
                {label}
            </dropdown-label>
            <div className='DropDownList-List'>
                {elements}
            </div>
        </dropdown-list>
    )
}

export default DropDownList;