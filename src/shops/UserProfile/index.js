import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { pigskit_restful_origin } from '../../utils/service_origins'
import './index.less'

const UserProfile = connect(
    (state) => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        username,
        nickname,
        deviceType,
        className,
    } = props

    return (
        <div className={clsx('UserProfile-Root', deviceType, className)}>
            <div className='AvatarBox'>
                <img src={`${pigskit_restful_origin()}/fs/user/avatar`}/>
            </div>
            <p>{nickname || username}</p>
        </div>
    )
})

export default UserProfile