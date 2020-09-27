import React from 'react'
import clsx from 'clsx'
import Measure from 'react-measure'
import ReactCrop from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css"
import { GoPlus } from "react-icons/go"
import { useDropScreen } from '../../DropScreen'
import RectButton from '../RectButton'
import './index.less'

class ImageInput extends React.PureComponent {
    constructor(props) {
        super(props)
        this.crop = {
            unit: '%',
            height: 100,
            aspect: this.props.aspect || 1,
        }
        this.state = {
            height: 0,
            srcImageUrl: null,
            imageUrl: null,
        }
    }

    get srcImageUrl() {
        return this.state.srcImageUrl
    }

    set srcImageUrl(srcImageUrl) {
        window.URL.revokeObjectURL(this.srcImageUrl)
        this.setState({
            srcImageUrl: srcImageUrl,
        })
    }

    get imageUrl() {
        return this.state.imageUrl
    }

    set imageUrl(imageUrl) {
        window.URL.revokeObjectURL(this.imageUrl)
        this.setState({
            imageUrl: imageUrl,
        })
    }

    get tergetWidth() {
        return this.props.targetWidth
    }

    componentDidMount() {
        if (this.props.forwardRef) this.props.forwardRef.current = this
    }

    componentWillUnmount() {
        this.srcImageUrl = null
        this.imageUrl = null
    }

    onResize({ entry }) {
        if (entry) {
            this.setState({
                height: entry.width / this.crop.aspect,
            })
        }
    }

    loadSrcImageUrl(e) {
        if (e.target.files?.length > 0) {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                () => {
                    this.srcImageUrl = reader.result
                    this.openEdit()
                },
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    shouldClearSrcImageUrl() {
        if (!this.imageUrl) this.srcImageUrl = null
    }

    openEdit() {
        this.props.refDropScreen.current.open(
            <EditImage
                imageInput={this}
            />
        )
    }

    shouldOpenEdit() {
        if (this.imageUrl) {
            this.openEdit()
        }
    }

    closeEdit() {
        this.props.refDropScreen.current.close()
    }

    commitEdit(crop, imageBlob) {
        imageBlob.name = 'image.jpeg'
        this.imageUrl = window.URL.createObjectURL(imageBlob)
        this.crop = crop
        this.closeEdit()
    }

    deleteImage() {
        this.srcImageUrl = null
        this.imageUrl = null
        this.crop = {
            unit: '%',
            height: 100,
            aspect: this.props.aspect || 1,
        }
        this.closeEdit()
    }

    render() {
        return (
            <label
                className={clsx('ImageInput-root', this.props.className)}
            >
                <Measure
                    onResize={this.onResize.bind(this)}
                >
                    {({ measureRef }) => (
                        <div
                            ref={measureRef}
                            className='Preview'
                            style={{
                                height: this.state.height,
                            }}
                            onClick={this.shouldOpenEdit.bind(this)}
                        >
                            {
                                this.imageUrl ?
                                <img src={this.imageUrl}/> :
                                <GoPlus/>
                            }
                        </div>
                    )}
                </Measure>
                {
                    !this.srcImageUrl &&
                    <input
                        className='Input'
                        type='file'
                        accept='image/*'
                        onChange={this.loadSrcImageUrl.bind(this)}
                    />
                }
            </label>
        )
    }
}

export default React.forwardRef((props, ref) => {
    const refDropScreen = useDropScreen()

    return <ImageInput
        forwardRef={ref}
        refDropScreen={refDropScreen}
        {...props}
    />
})

class EditImage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            crop: this.props.imageInput.crop,
        }
    }

    onCropChange(crop, persentCrop) {
        this.setState({
            crop: persentCrop,
        })
    }

    onImageLoaded(image) {
        this.srcImage = image
    }

    commitEdit() {
        const srcImage = this.srcImage
        const crop = this.state.crop

        if (!srcImage || !crop.width || !crop.height) return

        const targetWidth = this.props.imageInput.targetWidth || 600
        const targetHeight = targetWidth / crop.aspect

        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight
        canvas.getContext('2d').drawImage(
            srcImage,
            srcImage.naturalWidth * crop.x / 100,
            srcImage.naturalHeight * crop.y / 100,
            srcImage.naturalWidth * crop.width / 100,
            srcImage.naturalHeight * crop.height / 100,
            0,
            0,
            targetWidth,
            targetHeight,
        )
        canvas.toBlob(blob => this.props.imageInput.commitEdit(crop, blob), 'image/jpeg', 0.9)
    }

    deleteImage() {
        this.props.imageInput.deleteImage()
    }

    componentWillUnmount() {
        this.props.imageInput.shouldClearSrcImageUrl()
    }

    render() {
        return (
            <div
                className='EditImage-root'
            >
                <ReactCrop
                    src={this.props.imageInput.srcImageUrl}
                    crop={this.state.crop}
                    onChange={this.onCropChange.bind(this)}
                    onImageLoaded={this.onImageLoaded.bind(this)}
                />
                <div
                    className='Footer'
                >
                    <RectButton
                        onClick={this.commitEdit.bind(this)}
                    >Ok</RectButton>
                    <RectButton
                        className='Delete'
                        onClick={this.deleteImage.bind(this)}

                    >Delete</RectButton>
                </div>
            </div>
        )
    }
}