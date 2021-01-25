import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

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

const CheckItemRoot = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
`

const CheckItem = (props) => {
    const {
        itemKey,
        isChecked = (itemKey) => false,
        onCheck = (itemKey) => {},
        children,
    } = props

    const checked = isChecked(itemKey)

    return (
        <CheckItemRoot
            className={clsx('CheckItem-root', checked && 'Checked')}
            onClick={() => onCheck(itemKey)}
        >
            {checked ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
            {children}
        </CheckItemRoot>
    )
}

export default React.forwardRef((props, ref) => <CheckList forwardRef={ref} {...props}/>)