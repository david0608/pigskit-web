import React, { useRef, useState } from 'react'
import Abstract from '../../../components/utils/Abstract'
import TextInput from '../../../components/utils/TextInput'
import RectButton from '../../../components/utils/RectButton'
import Decorate from '../../../components/utils/Decorate'
import './index.less'

export class SelectionData {
    constructor(props = {}) {
        this.name = props.name || ''
        this.price = props.price || null
    }
}

export class Selection extends React.PureComponent {
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

    get price() {
        return this.props.data.price
    }

    set price(price) {
        this.props.data.price = price
    }

    update(params) {
        this.name = params.name
        this.price = params.price
        this.blur()
        this.forceUpdate()
    }

    delete() {
        this.props.customize.deleteSelection(this.props.data)
    }

    blur() {
        this.refRoot.current.blur()
    }

    render() {
        return (
            <Abstract
                ref={this.refRoot}
                className='Selection-root'
            >
                <Outline selection={this}/>
                <Detail selection={this}/>
            </Abstract>
        )
    }
}

const Outline = (props) => {
    const {
        selection,
    } = props

    return (
        <div className='Selection-outline'>
            <div className='Name'>
                {selection.name}
            </div>
            <Decorate.Price>
                {selection.price}
            </Decorate.Price>
        </div>
    )
}

const Detail = (props) => {
    const {
        selection,
    } = props

    const refName = useRef(null)
    const refPrice = useRef(null)

    const [inputError, setInputError] = useState({
        nameError: '',
        priceError: '',
    })

    const handleUpdate = () => {
        let error = false
        let nameError = ''
        let priceError = ''

        if (!refName.current.value) {
            nameError = 'Name is required.'
            error = true
        }

        if (!refPrice.current.value) {
            priceError = 'Price is Required.'
            error = true
        }

        if (error) {
            setInputError({
                nameError: nameError,
                priceError: priceError,
            })
            return
        }

        selection.update({
            name: refName.current.value,
            price: refPrice.current.value,
        })
    }

    return (
        <div className='Selection-detail'>
            <TextInput
                ref={refName}
                className='Name'
                label='Name'
                defaultValue={selection.name}
                error={inputError.nameError ? true : false}
                helperText={inputError.nameError}
            />
            <TextInput
                ref={refPrice}
                className='Price'
                label='Price'
                type='number'
                defaultValue={selection.price}
                error={inputError.priceError ? true : false}
                helperText={inputError.priceError}
            />
            <div className='Footer'>
                <RectButton onClick={handleUpdate}>Ok</RectButton>
                <RectButton onClick={() => selection.blur()}>Cancel</RectButton>
                <RectButton className='Delete' onClick={() => selection.delete()}>Delete</RectButton>
            </div>
        </div>
    )
}