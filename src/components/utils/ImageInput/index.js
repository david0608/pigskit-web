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

    componentDidMount() {
        if (this.props.forwardRef) this.props.forwardRef.current = this
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

        const scaleX = srcImage.naturalWidth / 100
        const scaleY = srcImage.naturalHeight / 100
        const canvas = document.createElement('canvas')
        canvas.width = crop.width * scaleX
        canvas.height = crop.height * scaleY
        canvas.getContext('2d').drawImage(
            srcImage,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
        )

        new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject()
                    }
                },
                'image/jpeg',
                1,
            )
        })
        .then((blob) => this.props.imageInput.commitEdit(crop, blob))
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