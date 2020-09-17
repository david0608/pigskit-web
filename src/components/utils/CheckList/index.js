import React from 'react'
import clsx from 'clsx'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import './index.less'

const CheckList = (props) => {
    const {
        listItems = {},
        isItemChecked,
        onItemCheck,
        ItemComponent = () => null,
    } = props

    return (
        Object.entries(listItems).map((e, i) => {
            let itemKey = e[0]
            let itemData = e[1]
            return (
                <CheckItem
                    key={i}
                    itemKey={itemKey}
                    isChecked={isItemChecked}
                    onCheck={onItemCheck}
                >
                    <ItemComponent
                        itemKey={itemKey}
                        itemData={itemData}
                    />
                </CheckItem>
            )
        })
    )
}

const CheckItem = (props) => {
    const {
        itemKey,
        isChecked = (itemKey) => false,
        onCheck = (itemKey) => {},
        children,
    } = props

    const checked = isChecked(itemKey)

    return (
        <div
            className={clsx('CheckItem-root', checked && 'Checked')}
            onClick={() => onCheck(itemKey)}
        >
            {checked ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
            {children}
        </div>
    )
}

export default React.forwardRef((props, ref) => <CheckList forwardRef={ref} {...props}/>)