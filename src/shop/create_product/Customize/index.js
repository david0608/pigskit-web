import React, { useState, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { GoPlus } from 'react-icons/go'
import { FloatList, FloatItem } from '../../../components/utils/FloatList'
import Abstract from '../../../components/utils/Abstract'
import { Switch, useSwitch } from '../../../components/utils/Switch'
import TextInput from '../../../components/utils/TextInput'
import RectButton from '../../../components/utils/RectButton'
import CircButton from '../../../components/utils/CircButton'
import Case from '../../../components/utils/Case'
import { T2 } from '../../../components/utils/Title'
import { Selection, SelectionData } from '../Selection'
import './index.less'

export class CustomizeData {
    constructor(props = {}) {
        this.name = props.name || ''
        this.description = props.description || ''
        this.selections = new Set()
        this.selectionsId = new WeakMap()
        this.currentId = 0
    }

    addSelection(data) {
        if (!this.selectionsId.has(data)) {
            this.selectionsId.set(data, this.currentId)
            this.selections.add(data)
            this.currentId++
        }
    }

    deleteSelection(data) {
        if (this.selectionsId.has(data)) {
            this.selectionsId.delete(data)
            this.selections.delete(data)
        }
    }

    selectionsMap(cb) {
        return Array.from(this.selections).map((e) => {
            return cb(e, this.selectionsId.get(e))
        })
    }

    hasSelection() {
        return this.selections.size !== 0
    }
}

export class Customize extends React.PureComponent {
    constructor(props) {
        super(props)
        this.refRoot = React.createRef()
    }

    get name() {
        return this.props.data.name
    }

    set name(name) {
        this.props.data.name = name
    }

    get description() {
        return this.props.data.description
    }

    set description(description) {
        this.props.data.description = description
    }

    get hasSelection() {
        return this.props.data.hasSelection()
    }

    update(params) {
        this.name = params.name
        this.description = params.description
        this.forceUpdate()
    }

    delete() {
        this.props.product.deleteCustomize(this.props.data)
    }

    addSelection(selection) {
        this.props.data.addSelection(selection)
        this.forceUpdate()
    }

    deleteSelection(selection) {
        this.props.data.deleteSelection(selection)
        this.focus()
        this.forceUpdate()
    }

    selectionsMap(cb) {
        return this.props.data.selectionsMap(cb)
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

    return (
        <div className={clsx('Customize-outline', deviceType)}>
            <div className='Info'>
                <div className='Name'>
                    {customize.name}
                </div>
                <div className={clsx('Desc', !customize.description && 'NoDesc')}>
                    {customize.description || 'No description'}
                </div>
            </div>
            <div className={clsx('Selections', !customize.hasSelection && 'NoSelc')}>
                {
                    customize.hasSelection ?
                    customize.selectionsMap((sel, id) => {
                        return (
                            <div key={id} className='Selection'>
                                <div className='Name'>
                                    {sel.name}
                                </div>
                                <Case.Price>
                                    {sel.price}
                                </Case.Price>
                            </div>
                        )
                    }) :
                    'No selection'
                }
            </div>
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
        deviceType,
        customize,
    } = props

    const toggleSwitch = useSwitch()

    return (
        <div className='Customize-preview'>
            <T2 className='Title'>
                {customize.name}
                <CircButton onClick={toggleSwitch}><MdEdit/></CircButton>
            </T2>
            <div className={clsx('Desc', !customize.description && 'NoDesc')}>
                {customize.description || 'No desciption'}
            </div>
            <T2 className='Title-selections'>
                with selections
                <NewSelection
                    className='New'
                    customize={customize}
                />
            </T2>
            <Case.List>
                {
                    customize.hasSelection ?
                    customize.selectionsMap((sel, id) => (
                        <Selection
                            key={id}
                            data={sel}
                            customize={customize}
                        />
                    )) :
                    <Case.Blank>No selectiom</Case.Blank>
                }
            </Case.List>
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
    const refFoldItem = useRef(null)

    const [inputError, setInputError] = useState({
        nameError: '',
        priceError: '',
    })
    
    const handleAdd = () => {
        let error = false
        let nameError = ''
        let priceError = ''

        if (!refName.current.value) {
            nameError = 'Name is required.'
            error = true
        }

        if (!refPrice.current.value) {
            priceError = 'Price is required.'
            error = true
        }

        setInputError({
            nameError: nameError,
            priceError: priceError,
        })

        if (error) {
            setInputError({
                nameError: nameError,
                priceError: priceError,
            })
            return
        }

        customize.addSelection(new SelectionData({
            name: refName.current.value,
            price: refPrice.current.value,
        }))

        refFoldItem.current.startFold()
    }

    return (
        <FloatList
            className={clsx('NewSelection-root', className)}
            label={<CircButton><GoPlus/></CircButton>}
            rightAligned
            fullScreen={deviceType === 'mobile'}
        >
            <div className='Title'>
                New selection
            </div>
            <TextInput
                ref={refName}
                label='Name'
                error={inputError.nameError ? true : false}
                helperText={inputError.nameError}
                autoFocus
            />
            <TextInput
                ref={refPrice}
                label='Price'
                type='number'
                error={inputError.priceError ? true : false}
                helperText={inputError.priceError}
            />
            <FloatItem
                ref={refFoldItem}
                manualFold
            >
                <RectButton
                    onClick={handleAdd}
                >
                    Add
                </RectButton>
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

    const [nameError, setNameError] = useState('')

    const handleUpdateCustomize = useCallback(
        () => {
            if (!refName.current.value) {
                setNameError('Name is required.')
                return
            }
            customize.update({
                name: refName.current.value,
                description: refDesc.current.value,
            })
            toggleSwitch()
        },
        []
    )

    const handleDeleteCustomize = useCallback(
        () => customize.delete(),
        []
    )

    return (
        <div className='Customize-edit'>
            <TextInput
                ref={refName}
                className='Name'
                label='Name'
                defaultValue={customize.name}
                error={nameError ? true : false}
                helperText={nameError}
            />
            <TextInput
                ref={refDesc}
                className='Desc'
                label='Description'
                defaultValue={customize.description}
            />
            <div className='Footer'>
                <RectButton onClick={handleUpdateCustomize}>Ok</RectButton>
                <RectButton onClick={toggleSwitch}>Cancel</RectButton>
                <RectButton className='Delete' onClick={handleDeleteCustomize}>Delete</RectButton>
            </div>
        </div>
    )
}