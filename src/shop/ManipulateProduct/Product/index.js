import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { GoPlus } from "react-icons/go"
import { createAbort } from '../../../utils/abort'
import { FloatList, FloatItem } from '../../../components/utils/FloatList'
import ImageInput from '../../../components/utils/ImageInput'
import TextInput from '../../../components/utils/TextInput'
import CircButton from '../../../components/utils/CircButton'
import Button from '../../../components/utils/Button'
import Decorate from '../../../components/utils/Decorate'
import Customize from '../Customize'
import { shopProductsActions } from '../../Products'
import '../../../styles/text.less'
import './index.less'

class Product extends React.PureComponent {
    constructor(props) {
        super(props)
        this.abort = createAbort()
        this.refNameInput = React.createRef()
        this.refPriceInput = React.createRef()
        this.refDescriptionInput = React.createRef()
        this.refImageInput = React.createRef()
        this.state = {
            busy: false,
            errors: {
                name: '',
                price: '',
                image: '',
                unknown: '',
            }
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    componentWillUnmount() {
        this.abort.abort()
    }

    get payload() {
        return this.props.payload
    }

    get name() {
        return this.payload.getData('name')
    }

    get price() {
        return this.payload.getData('price')
    }

    get description() {
        return this.payload.getData('description')
    }

    get imageUrl() {
        return this.refImageInput.current.targetImageUrl
    }

    get deleteImage() {
        return this.refImageInput.current.shouldDeleteOriginImage
    }

    getCustomize(key) {
        return this.payload.getChild('customizes', key)
    }

    createCustomize(data) {
        this.payload.createChild('customizes', data)
        this.forceUpdate()
    }

    deleteCustomize(key) {
        this.payload.deleteChild('customizes', key)
        this.forceUpdate()
    }

    renderCustomizes() {
        let customizeKeys = this.payload.childKeys('customizes')
        if (customizeKeys.length === 0) {
            return <Decorate.Blank children='No customize'/>
        } else {
            return customizeKeys.map(key => <Customize key={key} product={this} customizeKey={key}/>)
        }
    }

    submit() {
        if (this.state.busy) return

        let hasError = false
        let errors = {
            name: '',
            price: '',
            image: '',
            unknown: '',
        }
        if (!this.refNameInput.current.value) {
            errors.name = 'Name is required.'
            hasError = true
        }
        if (!this.refPriceInput.current.value) {
            errors.price = 'Price is required.'
            hasError = true
        }
        this.setState({ errors: errors })

        if (hasError) return

        this.setState({ busy: true })
        this.payload.updateData({
            name: this.refNameInput.current.value,
            price: parseInt(this.refPriceInput.current.value),
            description: this.refDescriptionInput.current.value,
        })

        let abortTK = this.abort.signup()

        this.props.submit(abortTK.axiosCancelTk())
        .then((res) => {
            if (abortTK.isAborted() || res.status !== 200) {
                throw new Error('Failed to create product.')
            } else {
                this.props.refetchShopProducts()
                location.href = `${location.origin}/shop/?id=${this.props.shopId}#/products`
            }
        })
        .catch((err) => {
            if (abortTK.isAborted()) return
            
            switch (err.response?.data?.type) {
                case 'PayloadTooLarge':
                    this.setState({ errors: { ...this.state.errors, image: 'Image oversize.' } })
                    break
                default:
                    this.setState({ errors: { ...this.state.errors, unknown: 'Encountered an unknown error, please try again.' } })
            }
        })
        .finally(() => {
            if (!abortTK.isAborted()) {
                this.abort.signout(abortTK)
                this.setState({ busy: false })
            }
        })
    }

    render() {
        const {
            deviceType,
            title,
            originImageSrc,
        } = this.props

        return (
            <div className='ManipulateProduct-root'>
                <div className='Text_header_2nd' children={title}/>
                <TextInput
                    ref={this.refNameInput}
                    className='Name'
                    label='Name'
                    defaultValue={this.name}
                    error={this.state.errors.name ? true : false}
                    helperText={this.state.errors.name}
                />
                <TextInput
                    ref={this.refPriceInput}
                    className='Price'
                    label='Price'
                    type='number'
                    defaultValue={this.price}
                    error={this.state.errors.price ? true : false}
                    helperText={this.state.errors.price}
                />
                <TextInput
                    ref={this.refDescriptionInput}
                    className='Description'
                    label='Description'
                    defaultValue={this.description}
                />
                <ImageInput
                    ref={this.refImageInput}
                    className={clsx('Image', deviceType)}
                    aspect={2}
                    originImageSrc={originImageSrc}
                    vertical
                />
                {this.state.errors.image && <span className='Text_error' children={this.state.errors.image}/>}
                <div className={clsx('Customizes-title', 'Text_header_2nd')}>
                    with customizes
                    <NewCustomize product={this}/>
                </div>
                <Decorate.List
                    className='Customizes'
                    children={this.renderCustomizes()}
                />
                <div className='Footer'>
                    {this.state.errors.unknown && <span className='Text_error' children={this.state.errors.unknown}/>}
                    <Button
                        onMouseDown={this.submit.bind(this)}
                        loading={this.state.busy}
                        children='Ok'
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShop.data.shop.id,
    }),
    dispatch => ({
        refetchShopProducts: () => dispatch(shopProductsActions.refetchAction())
    })
)(Product)

const NewCustomize = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
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
        product.createCustomize({
            name: refName.current.value,
            description: refDesc.current.value,
        })
        refFoldItem.current.startFold()
    }
    
    return (
        <FloatList
            className='NewCustomize'
            label={<CircButton children={<GoPlus/>}/>}
            rightAligned
            fullScreen={deviceType === 'mobile'}
        >
            <div className={clsx('Title', 'Text_header_3rd')}>
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
                <Button
                    onClick={handleAdd}
                    children='Add'
                />
            </FloatItem>
        </FloatList>
    )
})