import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import ReactCrop from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css"
import { GoPlus, GoX, GoChevronRight, GoChevronDown } from "react-icons/go"
import { TiArrowBack} from 'react-icons/ti'
import { useDropScreen } from './DropScreen'
import axios from '../utils/axios'
import { createAbort } from '../utils/abort'
import { ImageBase } from './Image'
import RectButton from './RectButton'
import CircButton from './CircButton'

const ImageInputRoot = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    >.Origin {
        flex: 1;
    }

    >.Arrow {
        display: flex;
        align-items: center;
        justify-content: center;

        >svg {
            font-size: 24px;
        }
    }

    &.horizon {
        >.Arrow {
            margin: 0px 10px;
        }
    }

    &.vertical {
        flex-direction: column;

        >.Arrow {
            margin: 10px 0px;
        }

        >div {
            width: 100%;
        }
    }

    .Target {
        flex: 1;
        position: relative;

        button {
            position: absolute;
            top: -12px;
            right: -12px;
            z-index: 1;
        }

        .Image-root {
            border: dashed 1px rgba(0, 0, 0, 0.75);
        }

        input {
            display: none;
        }
    }
`

class ImageInput extends React.PureComponent {
    constructor(props) {
        super(props)
        this.crop = {
            unit: '%',
            height: 100,
            aspect: this.aspect,
        }
        this.state = {
            originImageUrl: null,
            sourceImageUrl: null,
            targetImageUrl: null,
            shouldDeleteOriginImage: false,
        }
        this.abort = createAbort()
    }

    get aspect() {
        return this.props.aspect || 1
    }

    get shouldDeleteOriginImage() {
        return this.state.shouldDeleteOriginImage
    }

    get originImageUrl() {
        return this.state.originImageUrl
    }

    set originImage(data) {
        URL.revokeObjectURL(this.originImageUrl)
        this.setState({
            originImageUrl: data && URL.createObjectURL(data)
        })
    }

    get sourceImageUrl() {
        return this.state.sourceImageUrl
    }

    set sourceImageUrl(url) {
        URL.revokeObjectURL(this.sourceImageUrl)
        this.setState({
            sourceImageUrl: url,
        })
    }

    get targetImageUrl() {
        return this.state.targetImageUrl
    }

    set targetImage(data) {
        URL.revokeObjectURL(this.targetImageUrl)
        this.setState({
            targetImageUrl: data && URL.createObjectURL(data),
        })
    }

    componentDidMount() {
        if (this.props.forwardRef) this.props.forwardRef.current = this
        this.loadOriginImage()
    }

    componentWillUnmount() {
        this.sourceImageUrl = null
        this.targetImage = null
        this.abort.abort()
    }

    loadOriginImage() {
        let src = this.props.originImageSrc
        if (!src) return

        const abortTk = this.abort.signup()
        axios({
            method: 'GET',
            url: src,
            responseType: 'blob',
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            if (abortTk.isAborted()) return
            this.originImage = res.data
        })
        .catch(err => console.error(err))
        .finally(() => {
            if (abortTk.isAborted()) return
            this.abort.signout(abortTk)
        })
    }

    loadSourceImageUrl(e) {
        if (e.target.files?.length > 0) {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                () => {
                    this.sourceImageUrl = reader.result
                    this.openEdit()
                },
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    shouldClearSourceImage() {
        if (!this.targetImageUrl) this.sourceImageUrl = null
    }

    openEdit() {
        this.props.refDropScreen.current.open(
            <EditImage
                imageInput={this}
            />
        )
    }

    shouldOpenEdit() {
        if (this.targetImageUrl) {
            this.openEdit()
        }
    }

    commitEdit(crop, image) {
        this.targetImage = image
        this.recoverOriginImage()
        this.crop = crop
        this.props.refDropScreen.current.close()
    }

    deleteImage() {
        this.sourceImageUrl = null
        this.targetImage = null
        this.crop = {
            unit: '%',
            height: 100,
            aspect: this.aspect,
        }
    }

    deleteOriginImage() {
        if (!this.originImageUrl) return
        this.deleteImage()
        this.setState({
            shouldDeleteOriginImage: true
        })
    }

    recoverOriginImage() {
        if (!this.shouldDeleteOriginImage) return
        this.setState({
            shouldDeleteOriginImage: false
        })
    }

    render() {
        const {
            className,
            vertical,
        } = this.props

        return (
            <ImageInputRoot className={clsx('ImageInput-root', vertical ? 'vertical' : 'horizon', className)}>
                {
                    this.originImageUrl &&
                    <>
                        <ImageBase
                            className='Origin'
                            src={this.originImageUrl}
                            presize
                        />
                        <div className='Arrow'>{vertical ? <GoChevronDown/> : <GoChevronRight/>}</div>
                    </>
                }
                <div className='Target'>
                    {
                        this.targetImageUrl ?
                        <CircButton
                            onClick={this.deleteImage.bind(this)}
                            children={this.originImageUrl ? <TiArrowBack/> : <GoX/>}
                        /> :
                        (
                            this.originImageUrl && (
                                this.shouldDeleteOriginImage ?
                                <CircButton
                                    onClick={this.recoverOriginImage.bind(this)}
                                    children={<TiArrowBack/>}
                                /> :
                                <CircButton
                                    onClick={this.deleteOriginImage.bind(this)}
                                    children={<GoX/>}
                                />
                            )
                        )
                    }
                    <label>
                        <ImageBase
                            blankLabel={<GoPlus/>}
                            src={this.targetImageUrl ? this.targetImageUrl : (this.shouldDeleteOriginImage ? null : this.originImageUrl)}
                            onClick={this.shouldOpenEdit.bind(this)}
                            presize
                        />
                        {
                            !this.sourceImageUrl &&
                            <input
                                type='file'
                                accept='image/*'
                                onChange={this.loadSourceImageUrl.bind(this)}
                            />
                        }
                    </label>
                </div>
            </ImageInputRoot>
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

const EditImageRoot = styled.div`
    text-align: center;
    padding: 40px 16px 16px;

    img {
        max-width: 80vw;
        max-height: 70vh;
    }

    >.Footer {
        margin-top: 16px;
        display: flex;

        >.MuiButton-root {
            margin: 0 auto;
            padding: 3px 8px;

            >.MuiButton-label {
                text-transform: none;
            }
        }
    }
`

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
        this.sourceImage = image
    }

    commitEdit() {
        const sourceImage = this.sourceImage
        const crop = this.state.crop

        if (!sourceImage || !crop.width || !crop.height) return

        const targetWidth = this.props.imageInput.targetWidth || 600
        const targetHeight = targetWidth / crop.aspect

        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight
        canvas.getContext('2d').drawImage(
            sourceImage,
            sourceImage.naturalWidth * crop.x / 100,
            sourceImage.naturalHeight * crop.y / 100,
            sourceImage.naturalWidth * crop.width / 100,
            sourceImage.naturalHeight * crop.height / 100,
            0,
            0,
            targetWidth,
            targetHeight,
        )
        canvas.toBlob(
            blob => {
                blob.name = 'image.jpeg'
                this.props.imageInput.commitEdit(crop, blob)
            },
            'image/jpeg',
            0.9,
        )
    }

    componentWillUnmount() {
        this.props.imageInput.shouldClearSourceImage()
    }

    render() {
        return (
            <EditImageRoot
                className='EditImage-root'
            >
                <ReactCrop
                    src={this.props.imageInput.sourceImageUrl}
                    crop={this.state.crop}
                    onChange={this.onCropChange.bind(this)}
                    onImageLoaded={this.onImageLoaded.bind(this)}
                />
                <div
                    className='Footer'
                >
                    <RectButton
                        onClick={this.commitEdit.bind(this)}
                    >
                        Ok
                    </RectButton>
                </div>
            </EditImageRoot>
        )
    }
}