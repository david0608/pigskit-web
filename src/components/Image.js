import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { MdImage } from 'react-icons/md'
import axios from '../utils/axios'
import { pigskit_restful_origin } from '../utils/service_origins'
import { createAbort } from '../utils/abort'

const ImageBaseComponent = styled.div`
    display: flex;
    border: solid 1px rgba(0, 0, 0, 0.2);

    >img {
        width: 100%;
    }

    &.blank, &.presize {
        display: block;
        position: relative;

        &::before {
            content: '';
            display: block;
            padding-top: 100%;
        }
    }

    &.blank>svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: rgba(0, 0, 0, 0.6);
    }

    &.presize>img {
        position: absolute;
        top: 0;
        height: 100%;
    }

    &.clickable {
        cursor: pointer;

        &:hover {
            position: relative;

            &::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, .1);
            }
        }
    }
`

const ImageBase = props => {
    const {
        className,
        presize,
        src,
        onClick,
        blankLabel,
    } = props

    return (
        <ImageBaseComponent
            className={clsx(
                'Image-root',
                !src && 'blank',
                presize && 'presize',
                onClick && 'clickable',
                className,
            )}
            onClick={onClick}
        >
            {src ? <img src={src}/> : blankLabel}
        </ImageBaseComponent>
    )
}

const Image = props => {
    const {
        url,
        ...otherProps
    } = props

    return <ImageBase {...otherProps} src={url && `${pigskit_restful_origin()}${url}`} blankLabel={<MdImage/>}/>    
}

class TryFetchImage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.abort = createAbort()
        this.state = {
            url: null
        }
    }

    componentDidMount() {
        const abortTK = this.abort.signup()
        axios({
            method: 'GET',
            url: `${pigskit_restful_origin()}${this.props.url}`,
            responseType: 'blob',
            cancelToken: abortTK.axiosCancelTk(),
        })
        .then((res) => {
            if (!abortTK.isAborted()) {
                this.setState({
                    url: URL.createObjectURL(res.data)
                })
            }
        })
        .catch((err) => console.error(err))
        .finally(() => {
            if (!abortTK.isAborted()) {
                this.abort.signout(abortTK)
            }
        })
    }

    componentWillUnmount() {
        this.abort.abort()
        URL.revokeObjectURL(this.state.url)
    }

    render() {
        const {
            url,
            ...otherProps
        } = this.props

        return <ImageBase {...otherProps} src={this.state.url} blankLabel={<MdImage/>}/>
    }
}

export {
    Image,
    ImageBase,
    TryFetchImage,
}