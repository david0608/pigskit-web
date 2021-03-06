import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Abstract from '../../../components/Abstract'
import TextInput from '../../../components/TextInput'
import Button from '../../../components/Button'
import Decorate from '../../../components/Decorate'

export default class Selection extends React.PureComponent {
    constructor(props) {
        super(props)
        this.refRoot = React.createRef()
    }

    get key() {
        return this.props.selectionKey
    }

    get customize() {
        return this.props.customize
    }

    get payload() {
        return this.customize.getSelection(this.key)
    }

    get name() {
        return this.payload.getData('name')
    }

    get price() {
        return this.payload.getData('price')
    }

    update(data) {
        this.payload.updateData(data)
        this.blur()
        this.forceUpdate()
    }

    delete() {
        this.customize.deleteSelection(this.key)
    }

    blur() {
        this.refRoot.current.blur()
    }

    render() {
        return (
            <Abstract ref={this.refRoot}>
                <Outline selection={this}/>
                <Detail selection={this}/>
            </Abstract>
        )
    }
}

const OutlineRoot = styled.div`
    padding: 8px 16px;
    display: flex;

    >div {
        flex: 1;
    }
`

const Outline = props => {
    const {
        selection,
    } = props

    return (
        <OutlineRoot>
            <div className='Name'>
                {selection.name}
            </div>
            <Decorate.Price>
                {selection.price}
            </Decorate.Price>
        </OutlineRoot>
    )
}

const DetailRoot = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;

    >.MuiTextField-root {
        margin: 0px 0px 24px;
        max-width: 200px;
    }

    >.Footer {
        display: flex;

        >button {
            width: 64px;
            height: 32px;

            &:not(:last-child) {
                margin-right: 8px;
            }

            &.Right {
                margin-left: auto;
            }
        }
    }
`

const Detail = props => {
    const {
        selection,
    } = props

    const refName = useRef(null)
    const refPrice = useRef(null)

    const [errors, setErrors] = useState({
        name: '',
        price: '',
    })

    const handleUpdate = () => {
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

        selection.update({
            name: refName.current.value,
            price: parseInt(refPrice.current.value),
        })
    }

    const handleCancel = () => selection.blue()

    const handleDelete = () => selection.delete()

    return (
        <DetailRoot>
            <TextInput
                ref={refName}
                className='Name'
                label='Name'
                defaultValue={selection.name}
                error={errors.name ? true : false}
                helperText={errors.name}
            />
            <TextInput
                ref={refPrice}
                className='Price'
                label='Price'
                type='number'
                defaultValue={selection.price}
                error={errors.price ? true : false}
                helperText={errors.price}
            />
            <div className='Footer'>
                <Button
                    onClick={handleCancel}
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
        </DetailRoot>
    )
}