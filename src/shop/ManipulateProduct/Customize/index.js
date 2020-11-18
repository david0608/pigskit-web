import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { GoPlus } from 'react-icons/go'
import { FloatList, FloatItem } from '../../../components/utils/FloatList'
import Abstract from '../../../components/Abstract'
import { Switch, useSwitch } from '../../../components/Switch'
import TextInput from '../../../components/TextInput'
import CircButton from '../../../components/CircButton'
import Button from '../../../components/Button'
import Decorate from '../../../components/Decorate'
import Selection from '../Selection'
import '../../../styles/text.less'
import './index.less'

export default class Customize extends React.PureComponent {
    constructor(props) {
        super(props)
        this.refRoot = React.createRef()
    }

    get key() {
        return this.props.customizeKey
    }

    get product() {
        return this.props.product
    }

    get payload() {
        return this.product.getCustomize(this.key)
    }

    get name() {
        return this.payload.getData('name')
    }

    get description() {
        return this.payload.getData('description')
    }

    update(data) {
        this.payload.updateData(data)
    }

    delete() {
        this.product.deleteCustomize(this.key)
    }

    getSelection(key) {
        return this.payload.getChild('selections', key)
    }

    createSelection(data) {
        this.payload.createChild('selections', data)
        this.forceUpdate()
    }

    deleteSelection(key) {
        this.payload.deleteChild('selections', key)
        this.forceUpdate()
        this.focus()
    }

    selectionKeys() {
        return this.payload.childKeys('selections')
    }

    renderSelections() {
        const keys = this.selectionKeys()
        if (keys.length === 0) {
            return <Decorate.Blank children='No selection'/>
        } else {
            return keys.map(key => <Selection key={key} customize={this} selectionKey={key}/>)
        }
    }

    focus() {
        this.refRoot.current.focus()
    }

    render() {
        return (
            <Abstract
                ref={this.refRoot}
                className='Customize-root'
            >
                <Outline customize={this}/>
                <Detail customize={this}/>
            </Abstract>
        )
    }
}

const Outline = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        customize,
    } = props

    const renderSelections = () => {
        const keys = customize.selectionKeys()
        if (keys.length === 0) {
            return (
                <div
                    className={clsx('Selections', 'Text_remark')}
                    children='No selection'
                />
            )
        } else {
            return (
                <div
                    className='Selections'
                    children={
                        keys.map(key => {
                            const selectionPayload = customize.getSelection(key)
                            return (
                                <div key={key} className='Selection'>
                                    <div
                                        className='Name'
                                        children={selectionPayload.getData('name')}
                                    />
                                    <Decorate.Price
                                        children={selectionPayload.getData('price')}
                                    />
                                </div>
                            )
                        })
                    }
                />
            )
        }
    }

    return (
        <div className={clsx('Customize-outline', deviceType)}>
            <div className='Info'>
                <div
                    className='Name'
                    children={customize.name}
                />
                <Desc customize={customize}/>
            </div>
            {renderSelections()}
        </div>
    )
})

const Detail = (props) => {
    const {
        customize,
    } = props

    return (
        <Switch
            className='Customize-detail'
            defaultContent={
                <Preview
                    customize={customize}
                />
            }
            switchedContent={
                <Edit
                    customize={customize}
                />
            }
        />
    )
}

const Preview = (props) => {
    const {
        customize,
    } = props

    const toggleSwitch = useSwitch()

    return (
        <div className='Customize-preview'>
            <div className={clsx('Title', 'Text_header_3rd')}>
                {customize.name}
                <CircButton
                    className='Right'
                    onClick={toggleSwitch}
                    children={<MdEdit/>}
                />
            </div>
            <Desc customize={customize}/>
            <div className={clsx('Title', 'Text_header_3rd')}>
                with selections
                <NewSelection
                    className='Right'
                    customize={customize}
                />
            </div>
            <Decorate.List
                children={customize.renderSelections()}
            />
        </div>
    )
}

const NewSelection = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        className,
        deviceType,
        customize,
    } = props

    const refName = useRef(null)
    const refPrice = useRef(null)
    const refFloatItem = useRef(null)

    const [errors, setErrors] = useState({
        name: '',
        price: '',
    })
    
    const handleAdd = () => {
        let hasError = false
        let errors = {
            name: '',
            price: '',
        }

        if (!refName.current.value) {
            errors.name = 'Name is required.'
            hasError = true
        }

        if (!refPrice.current.value) {
            errors.price = 'Price is required.'
            hasError = true
        }

        setErrors(errors)

        if (hasError) return

        customize.createSelection({
            name: refName.current.value,
            price: parseInt(refPrice.current.value),
        })

        refFloatItem.current.startFold()
    }

    return (
        <FloatList
            className={clsx('NewSelection-root', className)}
            label={<CircButton children={<GoPlus/>}/>}
            rightAligned
            fullScreen={deviceType === 'mobile'}
        >
            <div
                className={clsx('Title', 'Text_header_3rd')}
                children='New selection'
            />
            <TextInput
                ref={refName}
                label='Name'
                error={errors.name ? true : false}
                helperText={errors.name}
                autoFocus
            />
            <TextInput
                ref={refPrice}
                label='Price'
                type='number'
                error={errors.price ? true : false}
                helperText={errors.price}
            />
            <FloatItem
                ref={refFloatItem}
                manualFold
            >
                <Button
                    onClick={handleAdd}
                    children='Add'
                />
            </FloatItem>
        </FloatList>
    )
})

const Edit = (props) => {
    const {
        customize,
    } = props

    const toggleSwitch = useSwitch()

    const refName = useRef(null)
    const refDesc = useRef(null)

    const [errors, setErrors] = useState({
        name: '',
    })

    const handleUpdate = () => {
        if (!refName.current.value) {
            setErrors({
                name: 'Name is required.'
            })
            return
        }
        customize.update({
            name: refName.current.value,
            description: refDesc.current.value,
        })
        toggleSwitch()
    }

    const handleDelete = () => {
        customize.delete()
    }

    return (
        <div className='Customize-edit'>
            <TextInput
                ref={refName}
                className='Name'
                label='Name'
                defaultValue={customize.name}
                error={errors.name ? true : false}
                helperText={errors.name}
            />
            <TextInput
                ref={refDesc}
                className='Desc'
                label='Description'
                defaultValue={customize.description}
            />
            <div className='Footer'>
                <Button
                    onClick={toggleSwitch}
                    children='Cancel'
                />
                <Button
                    onClick={handleUpdate}
                    children='Ok'
                />
                <Button
                    className='Right'
                    onClick={handleDelete}
                    children='Delete'
                />
            </div>
        </div>
    )
}

const Desc = props => {
    const {
        customize,
    } = props

    return (
        customize.description ?
        <div
            className='Desc'
            children={customize.description}
        /> :
        <div
            className={clsx('Desc', 'Text_remark')}
            children='No description'
        />
    )
}