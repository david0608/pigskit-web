import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import DropDownList from '../utils/DropDownList'
import Button from '../utils/Button'
import './index.less'

const ControlBar = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        newDropDownContent,
    } = props

    return (
        <div className='ControlBar-Root'>
            <div>Search</div>
            {newDropDownContent && <NewDropDown>{newDropDownContent}</NewDropDown>}
        </div>
    )
})

const NewDropDown = (props) => {
    return (
        <DropDownList className={clsx('RightAligned', 'NewDropDown-Root')}>
            <Button><GoPlus/>New</Button>
            {props.children}
        </DropDownList>
    )
}

export default ControlBar