import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { FloatList, FloatItem } from '../../../components/utils/FloatList'
import ImageInput from '../../../components/utils/ImageInput'
import TextInput from '../../../components/utils/TextInput'
import CircButton from '../../../components/utils/CircButton'
import RectButton from '../../../components/utils/RectButton'
import Decorate from '../../../components/utils/Decorate'
import { T1 } from '../../../components/utils/Title'
import axios from '../../../utils/axios'
import { createAbort } from '../../../utils/abort'
import { Customize, CustomizeData } from '../Customize'
import './index.less'

class ProductData {
    constructor(props = {}) {
        this.name = props.name || ''
        this.price = props.price || null
        this.description = props.description || ''
        this.seriesId = props.seriesId || ''
        this.customizes = new Set()
        this.customizesId = new WeakMap()
        this.currentId = 0
    }

    addCustomize(data) {
        if (!this.customizesId.has(data)) {
            this.customizesId.set(data, this.currentId)
            this.customizes.add(data)
            this.currentId++
        }
    }

    deleteCustomize(data) {
        if (this.customizesId.has(data)) {
            this.customizesId.delete(data)
            this.customizes.delete(data)
        }
    }

    customizesMap(cb) {
        return Array.from(this.customizes).map((e) => {
            return cb(e, this.customizesId.get(e))
        })
    }

    hasCustomize() {
        return this.customizes.size !== 0
    }

    toJsonString() {
        return JSON.stringify({
            name: this.name,
            price: parseInt(this.price),
            description: this.description,
            customizes: Array.from(this.customizes).map((cus) => ({
                name: cus.name,
                description: cus.description,
                selections: Array.from(cus.selections).map((sel) => ({
                    name: sel.name,
                    price: parseInt(sel.price)
                }))
            }))
        })
    }
}

class Product extends React.PureComponent {
    constructor(props) {
        super(props)
        this.data = new ProductData()
        this.abort = createAbort()
        this.refImageInput = React.createRef()
        this.state = {
            busy: false,
            nameError: '',
            priceError: '',
            imageError: '',
            hintError: '',
        }
    }

    get hasCustomize() {
        return this.data.hasCustomize()
    }

    addCustomize(customize) {
        this.data.addCustomize(customize)
        this.forceUpdate()
    }

    deleteCustomize(customize) {
        this.data.deleteCustomize(customize)
        this.forceUpdate()
    }

    customizesMap(cb) {
        return this.data.customizesMap(cb)
    }

    commit() {
        if (this.state.busy) return

        let error = false
        let nameError = ''
        let priceError = ''

        if (!this.data.name) {
            nameError = 'Name is requried.'
            error = true
        }

        if (!this.data.price) {
            priceError = 'Price is required.'
            error = true
        }

        this.setState({
            nameError: nameError,
            priceError: priceError,
            imageError: '',
            hintError: '',
        })

        if (error) return

        this.setState({
            busy: true,
        })

        let abortTK = this.abort.signup()

        Promise.resolve()
        .then(() => {
            const formData = new FormData()
            formData.append('shop_id', this.props.shop_id)
            formData.append('payload', this.data.toJsonString())

            if (this.refImageInput.current?.imageUrl) {
                return fetch(this.refImageInput.current.imageUrl)
                    .then((res) => res.blob())
                    .then((image) => {
                        formData.append('image', image)
                        return formData
                    })
            } else {
                return formData
            }
        })
        .then((formData) => {
            return axios({
                method: 'POST',
                url: '/api/shop/product',
                data: formData,
                cancelToken: abortTK.axiosCancelTk(),
            })
        })
        .then((res) => {
            if (abortTK.isAborted() || res.status !== 200) {
                throw new Error('Failed to create product.')
            } else {
                location.href = `${location.origin}/shop/?id=${this.props.shop_id}#/products`
            }
        })
        .catch((err) => {
            if (abortTK.isAborted()) return
            
            switch (err.response?.data?.type) {
                case 'PayloadTooLarge':
                    this.setState({
                        imageError: 'Image size too large.',
                    })
                    break
                default:
                    this.setState({
                        hintError: 'Encountered an unknown error, please try again.',
                    })
            }
        })
        .finally(() => {
            if (!abortTK.isAborted()) {
                this.abort.signout(abortTK)
                this.setState({
                    busy: false,
                })
            }
        })
    }

    componentWillUnmount() {
        this.abort.abort()
    }

    render() {
        return (
            <div className='Product-root'>
                <T1>Create a new product</T1>
                <div className='Info'>
                    <TextInput
                        onChange={(e) => this.data.name = e.target.value}
                        className='Name'
                        label='Name'
                        error={this.state.nameError ? true : false}
                        helperText={this.state.nameError}
                    />
                    <TextInput
                        onChange={(e) => this.data.price = e.target.value}
                        className='Price'
                        label='Price'
                        type='number'
                        error={this.state.priceError ? true : false}
                        helperText={this.state.priceError}
                    />
                    <TextInput
                        onChange={(e) => this.data.description = e.target.value}
                        className='Desc'
                        label='Description'
                    />
                    <ImageInput
                        ref={this.refImageInput}
                        className='Image'
                        aspect={2}
                    />
                    {this.state.imageError ? <p className='ImageError'>{this.state.imageError}</p> : null}
                </div>
                <T1 className='Title-customize'>
                    with customizes
                    <NewCustomize
                        className='New'
                        product={this}
                    />
                </T1>
                <Decorate.List className='Customizes'>
                    {
                        this.hasCustomize ?
                        this.customizesMap((cus, id) => (
                            <Customize
                                key={id}
                                data={cus}
                                product={this}
                            />
                        )) :
                        <Decorate.Blank>No customize</Decorate.Blank>
                    }
                </Decorate.List>
                {this.state.hintError ? <p className='HintError'>{this.state.hintError}</p> : null}
                <div className='Footer'>
                    <RectButton
                        onMouseDown={this.commit.bind(this)}
                    >
                        Ok
                    </RectButton>
                </div>
            </div>
        )
    }
}

const NewCustomize = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        className,
        deviceType,
        product,
    } = props

    const refName = useRef(null)
    const refDesc = useRef(null)
    const refFoldItem = useRef(null)

    const [nameError, setNameError] = useState('')

    const handleAdd = () => {
        if (!refName.current.value) {
            setNameError('Name is required.')
            return
        }
        product.addCustomize(new CustomizeData({
            name: refName.current.value,
            description: refDesc.current.value
        }))
        refFoldItem.current.startFold()
    }
    
    return (
        <FloatList
            className={clsx('NewCustomize-root', className)}
            label={<CircButton><GoPlus/></CircButton>}
            rightAligned
            fullScreen={deviceType === 'mobile'}
        >
            <div className='Title'>
                New customize
            </div>
            <TextInput
                ref={refName}
                label='Name'
                error={nameError ? true : false}
                helperText={nameError}
                autoFocus
            />
            <TextInput
                ref={refDesc}
                label='Description'
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

export default Product