import React from 'react'
import clsx from 'clsx'
import { pigskit_restful_origin } from '../../utils/service_origins'
import './index.less'

const Avatar = (props) => {
    const {
        className,
    } = props

    return (
        <div className={clsx('Avatar-root', className)}>
            <img src={`${pigskit_restful_origin()}/fs/user/avatar`}/>
        </div>
    )
}

export default Avatar