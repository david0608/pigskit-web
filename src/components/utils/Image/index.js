import React from 'react'
import clsx from 'clsx'
import { MdImage } from 'react-icons/md'
import axios from '../../../utils/axios'
import { pigskit_restful_origin } from '../../../utils/service_origins'
import { createAbort } from '../../../utils/abort'
import './index.less'

export class TryFetchImage extends React.PureComponent {
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

const Image = props => {
    const {
        url,
        ...otherProps
    } = props

    return <ImageBase {...otherProps} src={url && `${pigskit_restful_origin()}${url}`} blankLabel={<MdImage/>}/>
}

export const ImageBase = props => {
    const {
        className,
        presize,
        src,
        onClick,
        blankLabel,
    } = props

    return (
        <div
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
        </div>
    )
}

export default Image