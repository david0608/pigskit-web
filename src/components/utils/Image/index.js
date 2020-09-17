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
            url: this.props.src,
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
        return (
            <div className={clsx('Image-root', !this.state.url && 'blank', this.props.className)}>
                {
                    this.state.url ?
                    <img src={this.state.url}/> :
                    <MdImage/>
                }
            </div>
        )
    }
}

const Image = (props) => {
    const {
        className,
        url,
    } = props

    return (
        <div className={clsx('Image-root', !url && 'blank', className)}>
            {
                url ?
                <img src={`${pigskit_restful_origin()}${url}`}/> :
                <MdImage/>
            }
        </div>
    )
}

export default Image